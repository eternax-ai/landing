---
title: "SILMARILS: Post-Quantum Authentication Without the Size Tax"
description: "How SILMARILS combines SPHINCS+ anchoring with compact, information-theoretic records for post-quantum blockchain authentication."
---

# SILMARILS: Post-Quantum Authentication Without the Size Tax

![Abstract post-quantum authentication architecture for SILMARILS](Hero_Image.png)

Post-quantum migration is usually framed as a key-replacement problem. For blockchains, however, it is more fundamentally an infrastructure problem.

The standard answer is straightforward: replace ECC with NIST-standardized post-quantum signatures. This approach is cryptographically sound, but it gives the system a permanent size tax that every node and user has to pay.

SILMARILS changes that cost curve. It gives post-quantum blockchain architectures a path to a **160-byte permanent authentication record**, information-theoretic long-term security, and per-transaction privacy, while anchoring post-quantum unforgeability in a conservative post-quantum cryptography standard.

The new paper, **"SILMARILS: Information-Theoretic and Quantum-Secure Designated-Verifier Signatures,"** a joint work by UBC and EternaX Labs, gives the formal construction, security model, and proofs behind that claim.

## Motivation

Most blockchains were built around a convenient cryptographic bargain. Elliptic curves, often ECDSA and Ed25519, made identity, authorization, and public verification fit into 64 bytes. That small object became the default shape of a blockchain transaction.

Post-quantum cryptography changes the price of that bargain. The NIST-standardized post-quantum signature schemes are much larger: ML-DSA signatures are measured in kilobytes, FN-DSA is smaller but still an order of magnitude larger than today's signatures, and SLH-DSA/SPHINCS+, the most conservative hash-based option, is larger still.

For many systems, that cost is acceptable. For a high-throughput blockchain, it compounds across bandwidth, storage, validator load, sync time, archive size, and node economics. A testnet can survive large signatures, but it cannot pretend that 10x to 100x authentication growth is invisible at institutional scale.

The motivation behind SILMARILS is demonstrating that information-theoretic techniques can deliver compact verification artifacts, allowing high-performance, post-quantum-safe blockchain architectures without carrying the full on-chain footprint of standardized post-quantum signatures.

## What the Paper Contributes

The paper provides the formal construction, security model, and proofs for SILMARILS.

At a high level, SILMARILS is built from a small algebraic core over a finite field and perfect 2-out-of-2 Shamir secret sharing. It supports two complementary modes:

1. **A two-party transferable designated-verifier mode** with designated-verifier simulatability and EUF-CMA-style unforgeability against non-designated verifiers in the ROM and QROM.
2. **A three-party information-theoretic mode** in the broadcast model of Fitzi et al., with simulation-based security and error 1/p, extended to quantum adversaries with classical inputs and outputs.

Although information-theoretic signatures are known to be possible, existing constructions do not provide efficient, reusable, and simulation-secure signatures in the multi-party, multi-use setting. The central contribution of SILMARILS is achieving information-theoretic security while retaining efficiency, scalability, and practical deployability for modern distributed systems.

That is why SILMARILS is interesting for blockchains: it is a novel authentication building block for systems where validators sit inside the validity path, records live forever, and size directly impacts infrastructure cost.

## The Post-Quantum Security Cost Curve

The EternaX L1 blockchain uses SILMARILS inside a dual-layer authentication design. The stack separates what should be conservative from what should be optimized for performance.

**SPHINCS+** provides the post-quantum security anchor. It is standardized by NIST as SLH-DSA, is a conservative hash-based choice, and avoids lattice assumptions, pairings, hidden algebraic structure, and trusted setups.

**SILMARILS** provides the compact permanent authentication record: **128 bytes**, plus a **32-byte verification artifact**, for **160 bytes total**.

That separation changes the cost curve. The system keeps conservative post-quantum assurance where it matters, while the permanent blockchain record becomes compact, information-theoretic, and privacy-preserving.

| Scheme | Signature size | Relative to ECDSA |
| --- | --- | --- |
| ECDSA / Ed25519 | ~64 B | 1x |
| FN-DSA / Falcon-512 | ~666 B | ~10x |
| ML-DSA-44 | ~1,312 B | ~20x |
| SLH-DSA / SPHINCS+-128s | ~7,856 B | ~123x |
| **EternaX dual-layer record** | **160 B** | **2.5x** |

Standard post-quantum signatures can fit in a block, but the question is whether a post-quantum chain can keep full nodes practical, validators broadly accessible, and transaction volume institutional-scale without making authentication overhead the dominant long-term tax.

Post-quantum security that destroys performance is not a complete solution.

## How Designated Verification Fits in Blockchains

Designated-verifier signatures are often discussed as if they are unsuitable for blockchains because they are not ordinary public signatures. That objection assumes the wrong target.

Blockchains do not need every cryptographic object to be a standalone public signature forever. They need transactions to be authorized, accepted by validators, committed through consensus, and auditable under the rules of the system. Those requirements are related, but they are not identical.

This is where SILMARILS fits. Validators are not passive readers of public signatures. They are active participants in the consensus process: they receive transactions, evaluate authorization, apply state-transition rules, and finalize the ledger under protocol rules. The designated-verifier model matches that architecture instead of forcing every authorization artifact to behave like a forever-public standalone signature.

That is also why the paper matters beyond the 160-byte number. It formalizes the security of this model: designated-verifier simulatability, unforgeability against non-designated parties, simulation-based security in the three-party setting, and analysis in both classical and quantum random-oracle models.

## Long-Term Records Need a Different Posture

Standard post-quantum signatures are the right tool for many jobs, and SPHINCS+ is the conservative choice among them. But after security is solved by adopting a standardized post-quantum signature, blockchains as resource-constrained systems have a second problem: records are permanent.

For stablecoins, tokenized treasuries, tokenized deposits, RWAs, exchanges, and market infrastructure, the relevant horizon is the lifetime of the asset, the audit trail, the regulator, the court record, and the archive.

SILMARILS gives the permanent authentication record information-theoretic security. That means the record is not merely relying on a hardness assumption against known quantum algorithms; it has a stronger long-term integrity posture for the part of the system that lives forever.

That is the real meaning of the 160-byte record: it is smaller, but size is not the whole point. It is a strategic allocation of trust, cost, and permanence.

## Privacy Without ZK

Post-quantum migration also forces a privacy decision.

A standard post-quantum chain that publishes the same verification key across many transactions inherits the same core privacy failure as classical public blockchains. If the public can associate transactions with the same account key, the transaction graph accumulates forever. Once a counterparty, analytics vendor, investigator, or state actor links the key to an institution, the history is no longer pseudonymous in any meaningful sense.

The usual answer is zero-knowledge proofs. But post-quantum-compatible ZK generally means larger proofs, heavier proving, and more complex systems prone to more implementation-level vulnerabilities. That may be acceptable for some applications. It is not a free answer for high-throughput settlement.

Dual-layer authentication gives EternaX a different privacy primitive. SILMARILS supports per-transaction unlinkability and auditable selective disclosure as structural properties of the authentication layer. External observers do not get a reusable public key that turns the chain into a permanent account graph. The account owner can disclose what needs to be verified, when it needs to be verified, without making the entire transaction history public by default.

The institutional requirement for privacy onchain is not secrecy or opacity, but controlled disclosure: confidential to the market, auditable to the right party, and durable under post-quantum threat models.

## Outlook

Quantum computing is a threat to today's blockchain cryptography, but it is also a forcing function. It gives the industry a reason to reassess inherited assumptions: that authentication must look like ECDSA forever, that privacy requires heavy ZK machinery, and that post-quantum security necessarily means accepting a permanent size tax.

**EternaX transactions are backed by SPHINCS+ for conservative post-quantum security and produce a 160-byte permanent authentication record with information-theoretic security and per-transaction privacy.**

With the SILMARILS paper, our contribution is to give the cryptographic construction and proofs for that direction. The concrete ledger architecture integration is coming in a separate companion publication.

The goal is not only to survive the quantum transition. It is to use it to build better rails: native, compact, private, auditable, and fast enough for the next generation of market infrastructure.
