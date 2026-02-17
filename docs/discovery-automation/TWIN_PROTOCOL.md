# The Twin Protocol — Image + Digital Pairing

> **Date**: February 15, 2026
> **Authors**: John + Cassie
> **Branch**: `johnny5i-branch`
> **Status**: Protocol design — ready for review

---

## The Idea

Every digitized document exists as **twins** — permanently bonded:

```
        THE TWIN PROTOCOL

    ┌──────────────┐     ┌──────────────┐
    │  IMAGE TWIN  │ ══╦═│ DIGITAL TWIN │
    │   (source)   │   ║ │  (utility)   │
    │              │   ║ │              │
    │ • Scan/photo │   ║ │ • OCR'd text │
    │ • Faithful   │   ║ │ • Searchable │
    │   reproduction   ║ │ • Parseable  │
    │ • What it    │   ║ │ • What the   │
    │   looked like│   ║ │   machine    │
    │              │   ║ │   reads      │
    └──────────────┘   ║ └──────────────┘
                       ║
                 TWIN BOND
              (permanent link)
              (never separated)
```

**Rule #1**: You can't have a digital without its image.
**Rule #2**: The image is the authority. If there's a dispute about what the document says, the image wins.
**Rule #3**: The bond is permanent. They travel together, are produced together, and are verified together.

---

## Why This Matters

Physical documents in discovery get digitized constantly — handwritten notes, signed contracts, faxes, printed emails with handwritten annotations, evidence photos with chain-of-custody tags, etc. Today, firms either:

1. **Keep only the scan** — lose the searchability
2. **Keep only the OCR** — lose the visual fidelity (signatures, handwriting, stamps, stains, physical damage)
3. **Keep both but don't link them** — eventually one version gets separated, lost, or produced without its counterpart

AutoDiscovery's Twin Protocol ensures both versions exist, are linked, and are verifiable.

---

## The Twin Bond Record

```
┌─────────────────────────────────────────────────────────────┐
│                       TWIN BOND                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Bond ID:           [unique identifier for this pair]        │
│  Document ID:       [shared — both twins reference this]     │
│  Bates #:           [shared — one Bates # for the pair]     │
│                                                               │
│  ═══ IMAGE TWIN ═══                                          │
│  Image Hash:        [SHA-256 of image file]                  │
│  Image Format:      TIFF | PNG | JPEG | PDF-IMAGE            │
│  Image Resolution:  [DPI — minimum 300 for legal use]        │
│  Image Size:        [dimensions + file size]                 │
│  Color Mode:        COLOR | GRAYSCALE | B&W                  │
│  Source:            SCANNER | CAMERA | FAX | SCREENSHOT       │
│  Scan Date:         [when the physical was digitized]        │
│  Scanned By:        [person + device ID]                     │
│                                                               │
│  ═══ DIGITAL TWIN ═══                                        │
│  Digital Hash:      [SHA-256 of digital file]                │
│  Digital Format:    PDF-TEXT | DOCX | TXT | JSON              │
│  OCR Engine:        [which tool — Tesseract, ABBYY, etc.]   │
│  OCR Confidence:    [0.0 — 1.0 overall confidence score]    │
│  OCR Date:          [when OCR was performed]                 │
│  Word Count:        [extracted text word count]              │
│  Searchable:        YES | PARTIAL | NO                       │
│                                                               │
│  ═══ BOND METADATA ═══                                       │
│  Bond Created:      [timestamp]                              │
│  Created By:        [person/system that created the pair]    │
│  Fidelity Score:    [how well the digital matches the image] │
│  Has Handwriting:   YES | NO                                 │
│  Has Signatures:    YES | NO                                 │
│  Has Stamps/Seals:  YES | NO                                 │
│  Has Annotations:   YES | NO (margin notes, highlights)      │
│  Has Redactions:    YES | NO (blacked-out sections)          │
│  Physical Damage:   NONE | MINOR | SIGNIFICANT               │
│                                                               │
│  ═══ VERIFICATION ═══                                        │
│  Bond Hash:         SHA-256(Image Hash + Digital Hash)       │
│  ZK PROOF:          "Twin pair [bond ID] verified:            │
│                      image [img_hash] and digital [dig_hash]  │
│                      are bonded at [timestamp]."             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### The Bond Hash

The bond itself gets a hash — `SHA-256(image_hash + digital_hash)`. This means:

- If the image is tampered with → bond hash changes
- If the digital is tampered with → bond hash changes
- If either twin is swapped out for a different file → bond hash changes
- The bond hash is what enters the Level 2 (Document) Merkle tree from our hashing architecture

```
In the Merkle tree:

Level 2 (Document):  Bond Hash ← this is the document's identity
                     /        \
Level 1 (Twins): Image Hash   Digital Hash
                    |              |
Level 0 (Bytes): Raw image    Raw digital file
```

---

## The Digitization Workflow

```
PHYSICAL DOCUMENT ENTERS DISCOVERY
│
├─ 1. CAPTURE IMAGE
│     Scan or photograph the physical document
│     ├─ Minimum 300 DPI (court standard)
│     ├─ Color preferred (preserves ink color, highlights, stains)
│     ├─ Full-page capture (no cropping — edges matter)
│     └─ Multi-page: one image per page
│
├─ 2. GENERATE IMAGE HASH
│     SHA-256 of each page image
│     Image Merkle root if multi-page
│
├─ 3. RUN OCR / TRANSCRIPTION
│     ├─ Printed text → OCR engine (Tesseract, ABBYY, etc.)
│     ├─ Handwritten text → AI handwriting recognition
│     ├─ Mixed → both engines, merged output
│     └─ Confidence score generated per page + overall
│
├─ 4. GENERATE DIGITAL HASH
│     SHA-256 of the digital output
│     Digital Merkle root if multi-page
│
├─ 5. CREATE TWIN BOND
│     ├─ Bond Hash = SHA-256(image_hash + digital_hash)
│     ├─ Fidelity score calculated (image vs. digital comparison)
│     ├─ Visual features flagged (signatures, stamps, handwriting)
│     └─ Bond record created in AutoDiscovery
│
├─ 6. QUALITY CHECK
│     ├─ OCR confidence < 0.85? → FLAG for human review
│     ├─ Handwriting detected? → FLAG for manual transcription
│     ├─ Signatures detected? → FLAG for authentication
│     └─ Physical damage? → NOTE in bond metadata
│
└─ 7. ENTER DISCOVERY
      Both twins enter the system together
      Bond hash goes into the document's Merkle tree
      Neither twin can be produced without the other
```

---

## Page-Level Pairing for Multi-Page Documents

For a 50-page contract that's been scanned and OCR'd:

```
BOND: 50-page Contract

Page 1:  Image_p1 ══╦══ Digital_p1   Bond_p1 = SHA-256(img1 + dig1)
Page 2:  Image_p2 ══╦══ Digital_p2   Bond_p2 = SHA-256(img2 + dig2)
Page 3:  Image_p3 ══╦══ Digital_p3   Bond_p3 = SHA-256(img3 + dig3)
  ...
Page 50: Image_p50 ══╦══ Digital_p50 Bond_p50 = SHA-256(img50 + dig50)

Document Bond Root = Merkle root of [Bond_p1 ... Bond_p50]

             Document Bond Root
            /                   \
     H(bonds 1-25)        H(bonds 26-50)
      /          \          /          \
   ...          ...      ...          ...
    |            |        |            |
Bond_p1      Bond_p25  Bond_p26    Bond_p50
  / \          / \       / \          / \
img dig    img dig   img dig      img dig
```

Every page has its own twin bond. The document has a root bond. This means:

- Verify the whole document in one check (root bond)
- Verify any single page's image-to-digital fidelity (page bond)
- Detect if page 23's image was replaced but page 23's digital wasn't updated (bond breaks)
- Detect if someone OCR'd page 23 differently than what the image shows (fidelity score drops)

---

## Fidelity Scoring — Does the Digital Match the Image?

This is the clever part. We don't just *link* the twins — we score how faithfully the digital represents the image:

```
FIDELITY CHECK:
│
├─ Re-OCR the image independently
│  Compare output to the stored digital twin
│  Character-level diff → fidelity percentage
│
├─ Score:
│  ├─ 0.99 — 1.00: Excellent. Digital is a faithful representation.
│  ├─ 0.90 — 0.98: Good. Minor OCR artifacts (common).
│  ├─ 0.70 — 0.89: Moderate. Some text may be misread.
│  │                Human review recommended.
│  ├─ Below 0.70:   Poor. Handwriting, damage, or poor scan.
│  │                Manual transcription required.
│  └─ N/A:          Non-text content (photos, diagrams).
│
├─ Fidelity score is IMMUTABLE once set at bond creation.
│  If the digital is corrected later, a NEW bond is created
│  with a new fidelity score. The original bond is preserved
│  in history (like document versioning).
│
└─ ON DISPUTE: Re-run fidelity check. If the current score
   doesn't match the original, something was tampered with.
```

---

## Production Rules — Twins Travel Together

When a document with a twin bond is produced to another party:

```
TWIN PRODUCTION RULES:
│
├─ RULE 1: Both twins are produced. Always.
│  You don't send just the OCR'd PDF. You send the image too.
│
├─ RULE 2: The bond record accompanies the production.
│  Receiving party can verify the bond hash independently.
│
├─ RULE 3: If only one twin is produced, the system flags it.
│  "⚠️ Document DEF-000234 produced without its image twin.
│   Bond integrity cannot be verified."
│
├─ RULE 4: The receiving party can re-run fidelity check.
│  If their fidelity score differs from the bond record's score,
│  it means the digital was altered after bonding.
│
└─ RULE 5: For bandwidth/storage efficiency, the image twin
   can be produced on-demand rather than inline — but it MUST
   be available within 24 hours of request. The bond record
   is always inline.
```

### The On-Demand Optimization (Rule 5)

Some cases have millions of pages. Sending every image + digital doubles the transfer size. So:

```
DEFAULT PRODUCTION:
├─ Digital twin: inline (searchable, lightweight)
├─ Bond record: inline (metadata, hashes, fidelity score)  
└─ Image twin: ON-DEMAND (available via protocol request)

The receiving party can:
├─ Verify the bond using just the hashes (no image needed)
├─ Request specific images for documents they want to inspect
├─ Request ALL images if they want a full visual review
└─ The request/response is logged in the transfer record
```

This keeps production sizes manageable while guaranteeing image availability.

---

## Visual Feature Detection

When the image twin is created, the system flags visual elements that the digital twin **cannot fully capture**:

| Visual Feature | Why It Matters | Digital Twin Limitation |
|---------------|----------------|------------------------|
| **Signatures** | Authentication, execution proof | OCR can't verify authenticity |
| **Handwriting** | Margin notes, corrections | OCR accuracy drops significantly |
| **Stamps/Seals** | Notarization, court filing proof | Lost in text extraction |
| **Highlighting** | Shows what someone found important | Color information lost in B&W OCR |
| **Strikethroughs** | Shows what was intentionally deleted | Often missed by OCR |
| **Physical damage** | Water damage, tearing, fading | May cause OCR errors |
| **Sticky notes** | Added annotations | May cover underlying text |
| **Staple/clip marks** | Shows documents were physically grouped | Not captured digitally |
| **Ink color** | Different pens = different authors/times | Lost in B&W mode |
| **Paper type** | Letterhead, legal paper, copy vs. original | Not captured digitally |

```
VISUAL FEATURE ALERT — Bond [ID], Page 12:
─────────────────────────────────────────────
Detected: Handwritten margin note
Location: Right margin, lines 15-22
Content (AI attempt): "Check this with Bob — JS"
Confidence: 0.67 (low — handwriting)
OCR captured: NO (margin outside text zone)

⚠️  This annotation exists in the IMAGE twin only.
    The DIGITAL twin does not contain this content.
    Human review recommended.
─────────────────────────────────────────────
```

---

## How Twins Fit in the Hash Architecture

From the [DEEP_DIVE_HASHING_STRATEGY.md](./DEEP_DIVE_HASHING_STRATEGY.md):

```
BEFORE TWIN PROTOCOL:
Level 1 (Page):     page_hash ← hash of what? The scan? The OCR?

AFTER TWIN PROTOCOL:
Level 1 (Page):     bond_hash ← SHA-256(image_hash + digital_hash)
                    /         \
Level 0 (Twins): image_hash   digital_hash

The bond hash IS the page hash. It encompasses both representations.
A single hash that proves both twins exist and are linked.
```

This slots cleanly into the existing 5-level hierarchy without adding a new level — it refines Level 0-1 to account for the dual nature of digitized documents.

---

## The One-Liner

> **Every digitized document has a twin. The image is the truth. The digital is the tool. The bond is the proof they match.**

---

*This protocol applies to all digitized documents entering AutoDiscovery. Born-digital documents (emails, database exports, native electronic files) don't need twins — they ARE the original.*
