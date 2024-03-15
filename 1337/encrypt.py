#!/usr/bin/env python

from PIL import Image
import numpy as np
import random

def encrypt_image(file_name):
    img = Image.open(file_name)
    img_data = np.array(img)

    rows, cols, channels = img_data.shape

    seed = random.randint(1237, 1337)
    print(seed)

    random.seed(seed)
    perm = list(range(rows * cols))
    random.shuffle(perm)

    img_shuffled = np.zeros_like(img_data)

    for index, new_index in enumerate(perm):
        orig_i, orig_j = divmod(index, cols)
        new_i, new_j = divmod(new_index, cols)
        img_shuffled[new_i, new_j] = img_data[orig_i, orig_j]

    img_encrypted = Image.fromarray(img_shuffled)
    img_encrypted.save(file_name + ".enc")

encrypt_image('secret.png')
