# OPH universe run, level 6: 81,920 observers

One execution of the OPH executable model at federation scale: law C (integer nearest agreement with a
fair tie coin) on the exact federation of twelve-port carriers, from the declared preparation to the
balanced class and beyond. The loads and the per-attempt records are the executable specification with
nothing added. Depths, clocks, cuts and the Z6 register are declared layers computed from those records
without further randomness. `DATASET.md` in this directory defines every file and field.

| Quantity | Value |
| --- | --- |
| Carriers (observers) | 81,920 |
| Ports | 983,040 |
| Seams | 2,580,480 (122,880 between carriers) |
| Faces | 1,679,362 (40,962 screen plaquettes) |
| Preparation | exact06: numpy.random.default_rng(20260909 + level).integers(0, 6, size=ports) |
| Schedule seed | 915101 (schedule 1) |
| Sweeps | 500 (1,290,240,000 attempts) |
| Total load | 2,458,700, balanced band 2 and 3 |
| Descent functional V | 9,015,290 at the start, 6,395,260 at the end, minimum 6,395,260 |
| Balanced class | reached after 147,261,810 attempts |
| Causal depth at the end | 10821 to 10957 |
| Consistent cuts | 180, depths 0 to 10816 |
| Register | cost [0, 5, 8, 10, 8, 5], kappa 5, internal tier tracked: True |
| Defect identities | 786,662 |
| Featured observers | 32 |
| Backend | sequential |
| Size | 723.2 MB in 272 files |

## Source custody

The federation is built by the functions the executable model pins. Hashes of the local sources against
the literal pins in `reverse-engineering-reality/model/federated_observer/source.py`:

| Source | Defines this run | Equal to the model pin |
| --- | --- | --- |
| `oph_exact/carrier.py` | yes | yes |
| `oph_exact/federation.py` | reference check only | no |
| `oph_fpe/core/icosahedral.py` | yes | yes |
| `oph_fpe/core/screen_ports.py` | yes | yes |

Kernel attempt body sha256 `c39820aad764c83a4f4881f8b710e0eb49ef9b8f011ff8828a725a350b71d805`; numpy 2.3.5; python 3.13.7; macOS-15.3-arm64-arm-64bit-Mach-O.

## Files

| Path | Files | Size |
| --- | --- | --- |
| `DATASET.md` | 1 | 14.2 kB |
| `catalogue.npz` | 1 | 29.6 MB |
| `checkpoints` | 33 | 244.8 MB |
| `cuts` | 181 | 324.5 MB |
| `final_loads.npy` | 1 | 960.1 kB |
| `geometry.npz` | 1 | 2.6 MB |
| `observers` | 32 | 11.6 MB |
| `particle_map.json` | 1 | 146.8 kB |
| `records` | 4 | 27.8 MB |
| `run.json` | 1 | 81.6 kB |
| `series` | 10 | 49.3 MB |
| `stats.npz` | 1 | 40.1 kB |
| `view` | 5 | 31.9 MB |

## Reading it

```python
from oph_defects.dataset import Dataset
ds = Dataset('.')
cut = ds.cut(ds.cuts()[-1]["k"])      # the last clock-synchronised slice
cat = ds.catalogue()                    # one row per defect identity
obs = ds.observer(ds.meta["observers"][0]["carrier"])
rec = ds.records(0)                     # every attempt of sweep 0
```

Without this package: every `.npz` is a plain NumPy archive and `run.json` is plain JSON.
