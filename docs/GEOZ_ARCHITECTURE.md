# 🌐 GeoZ Oracle — Companion Project

> **GeoZ** is a **separate, independent project** by the same team — a privacy-preserving geolocation oracle built on Midnight.
>
> 🔗 **GeoZ Repository:** [github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle)
>
> **Domains:** [GeoZ.us](https://geoz.us) · [GeoZ.app](https://geoz.app)

---

## What Is GeoZ?

GeoZ is a privacy-preserving geolocation oracle that produces a ZK proof: *"This user is within Region R at time T"* — without revealing their exact coordinates, IP address, or network identity. It uses trusted issuer attestations (ISP, carrier, enterprise Wi-Fi) to verify location at the network level, making it **VPN-resistant and GPS-spoof-resistant**.

For full architecture, ISP attestation research, circuit design, and CAMARA integration details, see the [GeoZ repository](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle).

---

## Relationship to AutoDiscovery

**GeoZ is not a dependency of AutoDiscovery.** AutoDiscovery determines jurisdiction based on the court where the case is filed — which is known at case creation and doesn't require a geolocation oracle.

GeoZ and AutoDiscovery are **companion projects** by the same team, both built on Midnight:

| Project | What It Does |
|---------|-------------|
| **AutoDiscovery** | Automates legal discovery with jurisdiction-aware compliance, ZK proofs, and privacy-first architecture |
| **GeoZ** | Proves geographic region membership in ZK — general-purpose oracle for any application |

### Potential Future Synergies

While not required, GeoZ could optionally enhance AutoDiscovery in the future:

- **Optional location verification** — If a firm wants to cryptographically prove they operated from a specific jurisdiction (beyond just selecting it), GeoZ could provide that attestation
- **Multi-party cases** — In cases where party location matters (e.g., service of process across state lines), GeoZ could verify party locations without exposing addresses

These are **optional enhancements**, not core requirements. AutoDiscovery works fully without GeoZ.

---

*For full GeoZ documentation:*
*See [github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle)*
