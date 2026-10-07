# TensorFlow Lite Models Directory

Place your pre-trained TensorFlow Lite model file here:

`plant_disease_model.tflite`

## Model Specifications
- **Input Shape**: `[1, 224, 224, 3]` (RGB float32)
- **Pixel Normalization**: Scaled to `[0.0, 1.0]` or standard ImageNet mean/std
- **Output Shape**: `[1, 38]` (Probabilities / Softmax logits)
- **Class Labels Mapping**: See `labels.json` in this directory or `src/services/labels.ts`.

## Integrated Features
- On-device inference pipeline in `src/services/tfliteService.ts`
- Image preprocessing (Resizing, Normalization, RGB channel conversion)
- Softmax output postprocessing & Bangla metadata enrichment
