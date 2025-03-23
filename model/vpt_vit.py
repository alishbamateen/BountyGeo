import torch
import torch.nn as nn
import timm
from torch.nn import Dropout
import math
from functools import partial, reduce
from operator import mul

class DeepVPT_ViT(timm.models.vision_transformer.VisionTransformer):
    def __init__(self, in_pr, **kwargs):
        super().__init__(**kwargs)

        # self._m_is_global_pool = True if "global_pool" in kwargs else False
        self._m_num_tokens = in_pr
        self.prompt_dropout = Dropout(0.1)

        self.prompt_embeddings = nn.Parameter(
            torch.zeros(1, self._m_num_tokens, self.embed_dim)
        )

        self.deep_prompt_embeddings = nn.Parameter(
            torch.zeros(len(self.blocks) - 1, self._m_num_tokens, self.embed_dim)
        )

        val = math.sqrt(
            6.0
            / float(3 * reduce(mul, self.patch_embed.patch_size, 1) + self.embed_dim)
        )
        # xavier_uniform initialization
        nn.init.uniform_(self.prompt_embeddings.data, -val, val)

        self.deep_prompt_embeddings = nn.Parameter(
            torch.zeros(len(self.blocks) - 1, self._m_num_tokens, self.embed_dim)
        )
        # xavier_uniform initialization
        nn.init.uniform_(self.deep_prompt_embeddings.data, -val, val)

    def incorporate_prompt(self, x):
        B = x.shape[0]
        x = torch.cat(
            (
                x[:, :1, :],
                self.prompt_dropout(self.prompt_embeddings.expand(B, -1, -1)),
                x[:, 1:, :],
            ),
            dim=1,
        )
        return x

    def train(self, mode=True):
        # set train status for this class: disable all but the prompt-related modules
        if mode:
            # training:
            self.blocks.eval()
            self.patch_embed.eval()
            self.pos_drop.eval()
            self.prompt_dropout.train()
        else:
            # eval:
            for module in self.children():
                module.train(mode)

    def forward_features(self, x):

        x = self.patch_embed(x)
        x = self._pos_embed(x)
        x = self.patch_drop(x)
        x = self.norm_pre(x)

        for index, block in enumerate(self.blocks):
            B = x.shape[0]
            if index == 0:
                x = self.incorporate_prompt(x)
            else:
                x = torch.cat(
                    (
                        x[:, :1, :],
                        self.prompt_dropout(
                            self.deep_prompt_embeddings[index - 1].expand(B, -1, -1)
                        ),
                        x[:, (1 + self._m_num_tokens) :, :],
                    ),
                    dim=1,
                )
            x = block(x)

        x = self.norm(x)
        return x
    
def vpt_vit_base(in_pr, in_num_classes = 1000, **kwargs):
    model = DeepVPT_ViT(
        in_pr,
        patch_size=16,
        embed_dim=768,
        depth=12,
        num_heads=12,
        mlp_ratio=4,
        qkv_bias=True,
        norm_layer=partial(torch.nn.LayerNorm, eps=1e-6),
        num_classes=in_num_classes,
        **kwargs,
    )
    return model