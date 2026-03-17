import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
import cv2

class GradCAM:
    def __init__(self, model, layer_name=None):
        self.model = model
        self.layer_name = layer_name

        if layer_name is None:
            for layer in reversed(model.layers):
                if len(layer.output_shape) == 4:
                    self.layer_name = layer.name
                    break

        self.grad_model = Model(
            inputs=[self.model.inputs],
            outputs=[self.model.get_layer(self.layer_name).output, self.model.output]
        )

    def compute_heatmap(self, image, class_idx, eps=1e-8):
        with tf.GradientTape() as tape:
            conv_outputs, predictions = self.grad_model(image)
            loss = predictions[:, class_idx]

        grads = tape.gradient(loss, conv_outputs)

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + eps)

        return heatmap.numpy()

    def overlay_heatmap(self, heatmap, original_image, alpha=0.4, colormap=cv2.COLORMAP_JET):
        heatmap = cv2.resize(heatmap, (original_image.shape[1], original_image.shape[0]))

        heatmap = np.uint8(255 * heatmap)

        heatmap = cv2.applyColorMap(heatmap, colormap)

        superimposed = cv2.addWeighted(original_image, 1 - alpha, heatmap, alpha, 0)

        return superimposed

def generate_gradcam(model, image, original_image, class_idx):
    gradcam = GradCAM(model)

    heatmap = gradcam.compute_heatmap(image, class_idx)

    overlay = gradcam.overlay_heatmap(heatmap, original_image)

    return overlay, heatmap
