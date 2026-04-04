import json

NOTEBOOK_PATH = r"C:\Users\bisni\Desktop\NexCart\idm_vton_server.ipynb"

with open(NOTEBOOK_PATH, "r", encoding="utf-8") as f:
    nb = json.load(f)

assert "CELL 5" in nb["cells"][5]["source"][0]

# Completely replace Cell 5 with a clean, ordered vton_inference.py generator
# Key ordering rule: sys.path FIRST, then shims, then IDM-VTON imports
nb["cells"][5]["source"] = [
    "# CELL 5: Write vton_inference.py — order is critical:\n",
    "# 1. sys.path setup (MUST be first)\n",
    "# 2. Compatibility shims (cached_download, PositionNet)\n",
    "# 3. IDM-VTON imports\n",
    "code = (\n",
    "    'import sys, os, io\\n'\n",
    "    '# PATH FIRST — before any shim or diffusers import\\n'\n",
    "    'sys.path.insert(0, \"/content/IDM-VTON\")\\n'\n",
    "    'sys.path.insert(1, \"/content\")\\n'\n",
    "    'os.chdir(\"/content/IDM-VTON\")\\n'\n",
    "    'import torch, logging\\n'\n",
    "    'import torch.nn as _nn\\n'\n",
    "    '# SHIM 1: cached_download removed from huggingface_hub >= 0.23\\n'\n",
    "    'import huggingface_hub as _hfhub\\n'\n",
    "    'if not hasattr(_hfhub, \"cached_download\"):\\n'\n",
    "    '    _hfhub.cached_download = _hfhub.hf_hub_download\\n'\n",
    "    '# SHIM 2: PositionNet + FourierEmbedder removed from diffusers.models.embeddings >= 0.26\\n'\n",
    "    'import diffusers.models.embeddings as _demb\\n'\n",
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
    "    'import numpy as np\\n'\n",
    "    'from PIL import Image\\n'\n",
    "    'from torchvision import transforms\\n'\n",
    "    'from torchvision.transforms.functional import to_pil_image\\n'\n",
    "    'from src.tryon_pipeline import StableDiffusionXLInpaintPipeline as TryonPipeline\\n'\n",
    "    'from src.unet_hacked_garmnet import UNet2DConditionModel as UNet2DConditionModel_ref\\n'\n",
    "    'from src.unet_hacked_tryon import UNet2DConditionModel\\n'\n",
    "    'from utils_mask import get_mask_location\\n'\n",
    "    'import apply_net\\n'\n",
    "    'from preprocess.humanparsing.run_parsing import Parsing\\n'\n",
    "    'from preprocess.openpose.run_openpose import OpenPose\\n'\n",
    "    'from detectron2.data.detection_utils import convert_PIL_to_numpy\\n'\n",
    "    'logger = logging.getLogger(\"vton-inference\")\\n'\n",
    "    'DEVICE = \"cuda\" if torch.cuda.is_available() else \"cpu\"\\n'\n",
    "    'BASE_PATH = \"/content/vton_model\"\\n'\n",
    "    'CKPT_DIR = \"/content/vton_model/ckpt\"\\n'\n",
    "    'tensor_tf = transforms.Compose([transforms.ToTensor(), transforms.Normalize([0.5], [0.5])])\\n'\n",
    "    '_pipe = _openpose = _parsing = None\\n'\n",
    "    'def load_models():\\n'\n",
    "    '    global _pipe, _openpose, _parsing\\n'\n",
    "    '    if _pipe is not None: return\\n'\n",
    "    '    logger.info(\"Loading models on \" + DEVICE)\\n'\n",
    "    '    enc = UNet2DConditionModel_ref.from_pretrained(BASE_PATH, subfolder=\"unet_encoder\", torch_dtype=torch.float16)\\n'\n",
    "    '    unet = UNet2DConditionModel.from_pretrained(BASE_PATH, subfolder=\"unet\", torch_dtype=torch.float16)\\n'\n",
    "    '    _pipe = TryonPipeline.from_pretrained(BASE_PATH, unet=unet, torch_dtype=torch.float16, use_safetensors=True, variant=\"fp16\")\\n'\n",
    "    '    _pipe.unet_encoder = enc\\n'\n",
    "    '    _openpose = OpenPose(0)\\n'\n",
    "    '    _openpose.preprocessor.body_estimation.model.to(\"cpu\")\\n'\n",
    "    '    _parsing = Parsing(0)\\n'\n",
    "    '    logger.info(\"Models loaded.\")\\n'\n",
    "    'def run_tryon(person_img, garm_img, garment_des, auto_crop=True, denoise_steps=30, seed=42):\\n'\n",
    "    '    load_models()\\n'\n",
    "    '    garm_img = garm_img.convert(\"RGB\").resize((768, 1024))\\n'\n",
    "    '    orig = person_img.convert(\"RGB\")\\n'\n",
    "    '    left = top = 0; crop_size = None\\n'\n",
    "    '    if auto_crop:\\n'\n",
    "    '        w, h = orig.size\\n'\n",
    "    '        tw = int(min(w, h * 0.75)); th = int(min(h, w * 4/3))\\n'\n",
    "    '        left = (w - tw) / 2; top = (h - th) / 2\\n'\n",
    "    '        cropped = orig.crop((left, top, left+tw, top+th))\\n'\n",
    "    '        crop_size = cropped.size\\n'\n",
    "    '        human_img = cropped.resize((768, 1024))\\n'\n",
    "    '    else:\\n'\n",
    "    '        human_img = orig.resize((768, 1024))\\n'\n",
    "    '    kp = _openpose(human_img.resize((384, 512)))\\n'\n",
    "    '    mp, _ = _parsing(human_img.resize((384, 512)))\\n'\n",
    "    '    mask, _ = get_mask_location(\"hd\", \"upper_body\", mp, kp)\\n'\n",
    "    '    mask = mask.resize((768, 1024))\\n'\n",
    "    '    mg = (1 - transforms.ToTensor()(mask)) * tensor_tf(human_img)\\n'\n",
    "    '    human_np = convert_PIL_to_numpy(human_img.resize((384, 512)), format=\"BGR\")\\n'\n",
    "    '    args = apply_net.create_argument_parser().parse_args((\"show\", \"./configs/densepose_rcnn_R_50_FPN_s1x.yaml\", f\"{CKPT_DIR}/densepose/model_final_162be9.pkl\", \"dp_segm\", \"-v\", \"--opts\", \"MODEL.DEVICE\", \"cuda\"))\\n'\n",
    "    '    pose_arr = args.func(args, human_np)[:,:,::-1]\\n'\n",
    "    '    pose_img = Image.fromarray(pose_arr).resize((768, 1024))\\n'\n",
    "    '    _pipe.to(DEVICE); _pipe.unet_encoder.to(DEVICE)\\n'\n",
    "    '    _openpose.preprocessor.body_estimation.model.to(DEVICE)\\n'\n",
    "    '    neg = \"monochrome, lowres, bad anatomy, worst quality, low quality\"\\n'\n",
    "    '    with torch.no_grad():\\n'\n",
    "    '        with torch.cuda.amp.autocast():\\n'\n",
    "    '            pe,npe,ppe,nppe = _pipe.encode_prompt(\"model is wearing \"+garment_des, num_images_per_prompt=1, do_classifier_free_guidance=True, negative_prompt=neg)\\n'\n",
    "    '            pec,_,_,_ = _pipe.encode_prompt(\"a photo of \"+garment_des, num_images_per_prompt=1, do_classifier_free_guidance=True, negative_prompt=neg)\\n'\n",
    "    '            pt = tensor_tf(pose_img).unsqueeze(0).to(DEVICE, torch.float16)\\n'\n",
    "    '            gt = tensor_tf(garm_img).unsqueeze(0).to(DEVICE, torch.float16)\\n'\n",
    "    '            gen = torch.Generator(DEVICE).manual_seed(seed)\\n'\n",
    "    '            out = _pipe(prompt_embeds=pe.to(DEVICE,torch.float16), negative_prompt_embeds=npe.to(DEVICE,torch.float16), pooled_prompt_embeds=ppe.to(DEVICE,torch.float16), negative_pooled_prompt_embeds=nppe.to(DEVICE,torch.float16), num_inference_steps=denoise_steps, generator=gen, strength=1.0, pose_img=pt, text_embeds_cloth=pec.to(DEVICE,torch.float16), cloth=gt, mask_image=mask, image=human_img, height=1024, width=768, ip_adapter_image=garm_img.resize((768,1024)), guidance_scale=2.0)[0]\\n'\n",
    "    '    if auto_crop and crop_size:\\n'\n",
    "    '        r = out[0].resize(crop_size); orig.paste(r, (int(left), int(top))); return orig\\n'\n",
    "    '    return out[0]\\n'\n",
    ")\n",
    "with open('/content/vton_inference.py', 'w') as f:\n",
    "    f.write(code)\n",
    "print('vton_inference.py written — sys.path set first, all shims applied.')\n",
]

with open(NOTEBOOK_PATH, "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

# Verify
with open(NOTEBOOK_PATH, "r", encoding="utf-8") as f:
    nb2 = json.load(f)

src = nb2["cells"][5]["source"]
has_path_first = any("PATH FIRST" in l for l in src[:5])
has_shim1 = any("cached_download" in l for l in src)
has_shim2 = any("PositionNet" in l for l in src)
print(f"Cell 5 rewritten: {len(src)} lines")
print(f"  sys.path first: {'OK' if has_path_first else 'MISSING'}")
print(f"  SHIM 1 (cached_download): {'OK' if has_shim1 else 'MISSING'}")
print(f"  SHIM 2 (PositionNet): {'OK' if has_shim2 else 'MISSING'}")
