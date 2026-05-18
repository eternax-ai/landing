# SILMARILS: Compact Post-Quantum Authentication for Blockchain Systems 

![Abstract post-quantum authentication architecture for SILMARILS](Hero_Image.png)

Post-quantum migration is usually framed as a key-replacement problem. For blockchains, however, it is more fundamentally an infrastructure problem.

The standard answer is straightforward: replace ECC with NIST-standardized post-quantum signatures. This approach is cryptographically sound, but it gives the system a permanent size tax that every node and user has to pay.

Our new primitive, SILMARILS, changes that cost curve. It is a **160-byte designated-verifier signature** with EUF-CMA-style unforgeability against non-designated verifiers in the QROM, plus a complementary three-party mode with simulation-based security and information-theoretic error 1/p in the broadcast model of Fitzi et al.

EternaX builds on that primitive at the protocol layer. The blockchain architecture separates three jobs that are usually collapsed into one object: identity, transaction authentication, and public auditability after consensus. SILMARILS gives the authentication layer a compact algebraic record; SPHINCS+ provides the conservative post-quantum anchor in the identity layer.

The new paper, **[SILMARILS: Information-Theoretic and Quantum-Secure Designated-Verifier Signatures](https://arxiv.org/abs/2605.03230)** (arXiv:2605.03230), is joint work by Hassan Khodaiemehr, Khadijeh Bagheri, Chen Feng (University of British Columbia) and Dariia Porechna (EternaX Labs). It gives the formal construction, security model, and proofs. An [open-source Rust reference implementation](https://github.com/eternax-ai/silmarils-paper) is released alongside including benchmarks.

## Motivation

Most blockchains were built around a convenient cryptographic bargain. Elliptic curves, often ECDSA and Ed25519, made identity, authorization, and public verification fit into 64 bytes. That small object became the default shape of a blockchain transaction.

Post-quantum cryptography changes the price of that bargain. The NIST-standardized post-quantum signature schemes are much larger: ML-DSA signatures are measured in kilobytes, FN-DSA is smaller but still an order of magnitude larger than today's signatures, and SLH-DSA/SPHINCS+, the most conservative hash-based option, is larger still.

For many systems, that cost is acceptable. For a high-throughput blockchain, it compounds across bandwidth, storage, validator load, sync time, archive size, and node economics. A testnet can survive large signatures, but it cannot pretend that 10x to 100x authentication growth is invisible at institutional scale.

The motivation behind SILMARILS is demonstrating that designated-verifier techniques, analyzed against quantum adversaries, can deliver authentication records small enough to make a high-throughput post-quantum chain practical, without carrying the full on-chain footprint of standardized post-quantum signatures on every transaction.

## What the Paper Contributes

The paper provides the formal construction, security model, and proofs for SILMARILS.

At a high level, SILMARILS is built from a minimal algebraic core over a prime field and perfect 2-out-of-2 Shamir secret sharing. It supports two complementary modes:

1. **A two-party transferable designated-verifier mode** with Jakobsson–Sako–Impagliazzo designated-verifier simulatability and EUF-CMA¬DV unforgeability (existential unforgeability under chosen-message attack for all non-designated parties) in both the ROM and the QROM. The QROM bound reduces to PRF security of HMAC, collision resistance of the hash, an algebraic-core 1/p term, and an O(q²/p) measure-and-reprogram loss.
2. **A three-party information-theoretic mode** in the broadcast model of Fitzi et al., realizing the ideal three-party signature functionality with simulation-based security and error 1/p uniformly across the pure-IT, IT+ROM, and QROM models. The quantum extension is obtained through a trace-distance lift of the Fitzi local-property characterization (Lemma 18.15), using only CPTP contractivity and the triangle inequality, and avoiding the classical ROM techniques (rewinding, forking, oracle programming) that fail in the QROM.

Although information-theoretic signatures are known to be possible, existing constructions do not provide efficient, reusable, and simulation-secure signatures in the multi-party, multi-use setting. The central contribution of SILMARILS is achieving information-theoretic security in the three-party mode and quantum-secure unforgeability in the two-party mode within a single algebraic framework, while retaining efficiency, scalability, and practical deployability for modern distributed systems.

Full paper: [arXiv:2605.03230](https://arxiv.org/abs/2605.03230). Reference implementation: [github.com/eternax-ai/silmarils-paper](https://github.com/eternax-ai/silmarils-paper).

## From Primitive to Blockchain

Blockchains are a natural home for designated-verifier authentication because validators already sit inside the validity path. They receive transactions, verify authorization, apply state-transition rules, participate in consensus, and finalize the ledger under protocol rules.

EternaX uses that structure directly. Transaction authorization is checked by protocol participants before finality. Public auditability is produced by the finalized ledger, consensus receipts, and the public verification artifact. The result is a dual-layer authentication stack with separation of concerns:

1. SPHINCS+ provides the post-quantum security anchor. It is standardized by NIST as SLH-DSA, depends only on the security of standard hash functions, and is the most conservative of the NIST-standardized post-quantum signature families.

2. SILMARILS provides the compact authentication record: a 160-byte signature at the 256-bit field level, with a 32-byte receipt published for independent third-party verification after consensus.

The SILMARILS paper proves the primitive. EternaX composes that primitive into a blockchain architecture. The concrete ledger integration is coming in a separate companion publication.

## The Post-Quantum Security Cost Curve

Post-quantum public signatures are large because they solve a broad problem: any third party can verify the signature forever from public data alone. SILMARILS is optimized for a different but highly relevant setting: validator-mediated authentication inside a protocol that later produces public consensus evidence.

| Object | Verification model | Signature or record size | Role |
| --- | --- | --- | --- |
| ECDSA / Ed25519 | Public verifier | ~64 B | Today's compact baseline, not post-quantum |
| Falcon-512 / FN-DSA  | Public verifier | ~690 B | Smaller standardized PQ signature family |
| ML-DSA / Dilithium-2  | Public verifier | ~2,420 B | NIST-standardized lattice PQ signature family |
| SPHINCS+-128s / SLH-DSA | Public verifier | ~7,856 B | Conservative hash-based PQ signature family |
| SILMARILS TDV | Designated verifier | 160 B | Compact authentication inside the validity path |

Because SILMARILS is a designated-verifier construction, his comparison is not meant to suggest equivalence, but to illustrate efficiency in blockchain settings where PQC is more than sufficient but still expensive. SILMARILS is not a drop-in replacement for standardized PQ signatures; it is the authentication layer of a protocol designed from first principles to separate the concerns of identity, message authentication, and public auditability.

The systems result is a different cost curve. Standard post-quantum signatures can fit in a block, but the question is whether a post-quantum chain can keep full nodes practical, validators broadly accessible, and transaction volume at market speed without making authentication overhead the dominant long-term tax.

Post-quantum security that destroys performance is not a complete solution. EternaX keeps conservative post-quantum assurance where it is needed, while avoiding kilobytes of signature data on every transaction record.

## Why It Matters

For stablecoins, tokenized treasuries, tokenized deposits, exchanges, custodians, and market infrastructure, authentication is not a wallet feature, but a core part of the asset perimeter.

Issuer keys, mint and burn controls, freeze and compliance controls, custody workflows, and validator authorization all need a post-quantum migration path. If that path increases authentication data by an order of magnitude, the cost appears in bandwidth, throughput, TPS, transaction fees, storage, and ultimately liquidity venue economics.

SILMARILS gives EternaX a technical wedge that is difficult to copy by parameter tuning alone. Any chain can adopt standardized PQ signatures. EternaX's advantage is the composition:
1. a new authentication primitive with formal ROM, QROM, and information-theoretic analysis;
2. a compact 160-byte record suited to validator-mediated systems;
3. conservative SPHINCS+ anchoring for post-quantum assurance;
4. protocol-level integration into consensus and finality.

That path runs from paper to primitive, from primitive to protocol, and from protocol to product: post-quantum settlement rails for assets that cannot afford a late migration or a permanent throughput tax.

## Privacy Is a Structural Property

Post-quantum migration also forces a privacy decision.

A standard post-quantum chain that publishes the same verification key across many transactions inherits the same core privacy failure as classical public blockchains. If the public can associate transactions with the same account key, the transaction graph accumulates forever. Once a counterparty, analytics vendor, investigator, or state actor links the key to an institution, the history is no longer pseudonymous in any meaningful sense.

The usual answer is zero-knowledge proofs. But post-quantum-compatible ZK generally means larger proofs, heavier proving, and more complex systems prone to more implementation-level vulnerabilities. That may be acceptable for some applications. It is not a free answer for high-throughput settlement.

SILMARILS gives EternaX a different starting point. The 160-byte record authorizes a transaction to the validators who participate in the consensus protocol, rather than acting as a permanent public attestation that any observer can re-verify forever from a reusable account-level public key. The chain therefore does not accumulate the kind of per-account public artifact that turns a transaction history into an account graph for external observers.

At the protocol layer, EternaX builds on this property to give tiered selective disclosure and per-transaction unlinkability against external observers, without zero-knowledge machinery layered on top of a publicly verifiable signature object. The construction belongs to the companion publication; what matters here is that the SILMARILS primitive is the right shape for it.

The institutional requirement for privacy onchain is not secrecy or opacity, but controlled disclosure: confidential to the market, auditable to the right party, and durable under post-quantum threat models.

## Outlook

Quantum computing is a threat to today's blockchain cryptography, but it is also a forcing function. It gives the industry a reason to reassess inherited assumptions: that authentication must look like ECDSA forever, that privacy requires heavy ZK machinery, and that post-quantum security necessarily means accepting a permanent size tax.

SILMARILS gives EternaX a compact designated-verifier and information-theoretic authentication framework for systems where validators are part of the verification path. The paper establishes the primitive. EternaX turns that primitive into a post-quantum blockchain design with conservative public anchoring, compact transaction authentication, and auditable finality.

That combination opens a practical research direction for post-quantum finance: stop treating migration as a primitive swap, and redesign authentication around the actual structure of distributed ledgers. The goal is not only to survive the quantum transition. It is to use it to build better rails: native, compact, private, auditable, and fast enough for the next generation of market infrastructure.
