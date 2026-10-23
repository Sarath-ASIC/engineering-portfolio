# Credibility audit (as of 2026-10-23)

Rule used: every statement on the site must trace to something you told me. Anything else is flagged here.

## What the previous site claimed that is NOT supported (removed in this build)
| Old claim | Why removed |
|---|---|
| "Each project is taken from specification to a verified, synthesized design" | No project has published verification or synthesis results. |
| SPI: "synthesized with Genus; timing and area reviewed per mode", "scoreboard with reference model", "registered glitch-free SCLK", CRC | Not in your notes. Your notes say Fusion Compiler, a 16-file UVM env, assertions, a dual-clock Error Injection Unit. |
| SyncFlow FIFO, AXI4-Lite, Cache Controller written up as finished UVM projects, "pushed through OpenLane" | Your notes list them as portfolio targets only. They are now **unpublished drafts** in the seed data. |
| TDC project "Vivado" | Not stated for that project. |
| "Skills: Genus, OpenLane, Verilator, Python" | Not tied to any evidenced project. |

## Please confirm before this goes to recruiters
1. **Status of each project.** I set SPI, TDC-to-SPI, CDAC, E-TSPC and the CXL.mem bridge to "In progress", and RV32I to "Planned". Change to "Completed" only if finished.
2. **Your contribution** field is empty on most projects (shows nothing). Fill it in; recruiters ask.
3. **Skill levels.** "Used in project" is applied to Verilog/SV, CDC, UVM, SVA, functional coverage, VCS, Virtuoso. If any was mostly AI-assisted or you could not defend it in an interview, lower it to "Working knowledge" or "Currently learning". You told me earlier you consider yourself an amateur in SystemVerilog and a beginner in computer organisation, so be strict here.
4. **Cache Controller, AXI4-Lite, SyncFlow FIFO.** Exist only as hidden drafts. Publish only with a repo, a testbench and a status.
5. **KriSemi.** Only the title, employer and the upcoming-work line are shown. Confirm with KriSemi that the upcoming-work line (CXL to LPDDR5X for Edge AI super nodes) may be public, and give dates. If not cleared, delete the "Upcoming" field in Sanity.
6. **Evidence links** (GitHub repos, reports) are empty everywhere. Every project page says so honestly. Add links as they exist.
7. **Résumé.** None exists yet, so no download button is shown.
8. **Hero wording.** "Micro-computer Architecture" is kept as you wrote it; "Microarchitecture" is the standard term.

## Not on the site on purpose
Coverage %, pass rates, Fmax, area, power: none have been provided.
