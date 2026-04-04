import json

NOTEBOOK_PATH = r"C:\Users\bisni\Desktop\NexCart\idm_vton_server.ipynb"

with open(NOTEBOOK_PATH, "r", encoding="utf-8") as f:
    nb = json.load(f)

# Debug: print cells
for i, c in enumerate(nb["cells"]):
    src = c["source"]
    first = src[0].strip()[:60] if src else "(empty)"
    print(f"Cell {i}: {first}")

print()

# ──────────────────────────────────────────────────────────────────────────────
# CELL 2: Stop fighting pip. Don't pin diffusers at all — use whatever
# Colab has (0.29.x). The runtime shims in Cell 5 handle all compat.
# Only pin the packages IDM-VTON's high-level code actually needs.
# ──────────────────────────────────────────────────────────────────────────────
assert "CELL 2" in nb["cells"][2]["source"][0]

nb["cells"][2]["source"] = [
    "# CELL 2: Install dependencies\n",
    "#\n",
    "# NOTE: We do NOT pin diffusers or transformers versions here.\n",
    "# IDM-VTON source compatibility with modern diffusers is handled by\n",
    "# runtime shims injected into vton_inference.py in Cell 5:\n",
    "#   - cached_download removed in huggingface_hub >= 0.23\n",
    "#   - PositionNet removed from diffusers.models.embeddings >= 0.26\n",
    "#\n",
    "!pip install -q fastapi uvicorn pyngrok python-multipart\n",
    '!pip install -q "accelerate>=0.28.0" tqdm einops\n',
    "!pip install -q scipy opencv-python-headless Pillow\n",
    "!pip install -q --no-deps fvcore iopath\n",
    "!pip install -q cloudpickle omegaconf pycocotools basicsr av onnxruntime\n",
    "!python -m pip install -q 'git+https://github.com/facebookresearch/detectron2.git'\n",
    "print('Dependencies installed.')\n",
    "import diffusers; print(f'diffusers {diffusers.__version__} (shims will handle compat)')\n",
    "# !! IMPORTANT: Runtime -> Restart session after this cell, then re-run all from Cell 1",
]
print("Cell 2 updated: removed version pins, rely on shims")

# ──────────────────────────────────────────────────────────────────────────────
# CELL 5: Inject BOTH compat shims at the very top of vton_inference.py
# before ANY diffusers or IDM-VTON imports.
#
# Shim 1: huggingface_hub.cached_download (removed in hub >= 0.23)
# Shim 2: diffusers.models.embeddings.FourierEmbedder (removed in diffusers >= 0.26)
# Shim 3: diffusers.models.embeddings.PositionNet (removed in diffusers >= 0.26)
# ──────────────────────────────────────────────────────────────────────────────
assert "CELL 5" in nb["cells"][5]["source"][0], \
    f"Expected CELL 5 at index 5, got: {nb['cells'][5]['source'][0][:50]}"

src = nb["cells"][5]["source"]

SHIM_LINES = [
    # ---- huggingface_hub shim ----
    "    '# --- SHIM 1: cached_download removed from huggingface_hub >= 0.23 ---\\n'\n",
    "    'import huggingface_hub as _hfhub\\n'\n",
    "    'if not hasattr(_hfhub, \"cached_download\"):\\n'\n",
    "    '    _hfhub.cached_download = _hfhub.hf_hub_download\\n'\n",
    # ---- PositionNet + FourierEmbedder shim ----
    "    '# --- SHIM 2: PositionNet + FourierEmbedder removed from diffusers.models.embeddings >= 0.26 ---\\n'\n",
    "    'import torch, torch.nn as _nn, diffusers.models.embeddings as _demb\\n'\n",
    "    'if not hasattr(_demb, \"FourierEmbedder\"):\\n'\n",
    "    '    class FourierEmbedder(_nn.Module):\\n'\n",
    "    '        def __init__(self, num_freqs=64, temperature=100):\\n'\n",
    "    '            super().__init__()\\n'\n",
    "    '            freq = temperature ** (torch.arange(num_freqs) / num_freqs)\\n'\n",
    "    '            self.register_buffer(\"freq\", freq)\\n'\n",
    "    '        def forward(self, x):\\n'\n",
    "    '            x = x.unsqueeze(-1)\\n'\n",
    "    '            return torch.cat([torch.sin(x*self.freq), torch.cos(x*self.freq)], -1).flatten(-2)\\n'\n",
    "    '    _demb.FourierEmbedder = FourierEmbedder\\n'\n",
    "    'if not hasattr(_demb, \"PositionNet\"):\\n'\n",
    "    '    class PositionNet(_nn.Module):\\n'\n",
    "    '        def __init__(self, positive_len, out_dim, feature_type=\"text-only\", fourier_freqs=8):\\n'\n",
    "    '            super().__init__()\\n'\n",
    "    '            self.positive_len = positive_len\\n'\n",
    "    '            self.fourier_embedder = _demb.FourierEmbedder(num_freqs=fourier_freqs)\\n'\n",
    "    '            self.position_dim = fourier_freqs * 2 * 4 + 2\\n'\n",
    "    '            d = out_dim[0] if isinstance(out_dim, tuple) else out_dim\\n'\n",
    "    '            self.linears = _nn.Sequential(_nn.Linear(positive_len + self.position_dim, 512), _nn.SiLU(), _nn.Linear(512, 512), _nn.SiLU(), _nn.Linear(512, d))\\n'\n",
    "    '            self.null_positive_feature = _nn.Parameter(torch.zeros([positive_len]))\\n'\n",
    "    '            self.null_position_feature = _nn.Parameter(torch.zeros([self.position_dim]))\\n'\n",
    "    '        def forward(self, boxes, masks, positive_embeddings):\\n'\n",
    "    '            masks = masks.unsqueeze(-1)\\n'\n",
    "    '            xyxy = self.fourier_embedder(boxes)\\n'\n",
    "    '            pe = positive_embeddings*masks + (1-masks)*self.null_positive_feature.view(1,1,-1)\\n'\n",
    "    '            xyxy = xyxy*masks + (1-masks)*self.null_position_feature.view(1,1,-1)\\n'\n",
    "    '            return self.linears(torch.cat([pe, xyxy], -1))\\n'\n",
    "    '    _demb.PositionNet = PositionNet\\n'\n",
    "    '# --- end shims ---\\n'\n",
]

# Find the first real code line (import sys, os, io) and inject shims before it
injection_done = False
new_src = []
for i, line in enumerate(src):
    if not injection_done and ('"import sys, os, io\\n"' in line or "'import sys, os, io\\n'" in line):
        new_src.extend(SHIM_LINES)
        injection_done = True
    new_src.append(line)

if injection_done:
    nb["cells"][5]["source"] = new_src
    print(f"Cell 5: {len(SHIM_LINES)} shim lines injected before first IDM-VTON import")
else:
    print("WARNING: Could not find injection point in Cell 5")
    print("First 5 lines:")
    for line in src[:5]:
        print(repr(line)[:100])

with open(NOTEBOOK_PATH, "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

# Final verification
with open(NOTEBOOK_PATH, "r", encoding="utf-8") as f:
    nb2 = json.load(f)

shim1_ok = any("cached_download" in l for l in nb2["cells"][5]["source"])
shim2_ok = any("PositionNet" in l for l in nb2["cells"][5]["source"])
print(f"\nVerification:")
print(f"  SHIM 1 (cached_download): {'OK' if shim1_ok else 'MISSING'}")
print(f"  SHIM 2 (PositionNet):     {'OK' if shim2_ok else 'MISSING'}")
print(f"  Cell 2 pin-free:          {'OK' if 'diffusers==' not in ''.join(nb2['cells'][2]['source']) else 'STILL HAS PIN'}")
