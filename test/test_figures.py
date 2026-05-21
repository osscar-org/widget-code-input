from PIL import Image, ImageChops, ImageStat

new       = Image.open('widget-01.png')
reference = Image.open('test/widget-sample.png')

diff = ImageChops.difference(new, reference)
stat = ImageStat.Stat(diff)

if sum(stat.mean) == 0:
    print('images are the same')
else:
    w = max(new.width, reference.width, diff.width)
    h = max(new.height, reference.height, diff.height)
    composite = Image.new('RGB', (w * 3, h), 'white')
    composite.paste(reference, (0, 0))      # left:   reference
    composite.paste(new,       (w, 0))      # middle: new from this run
    composite.paste(diff,      (w * 2, 0))  # right:  pixel-wise diff
    composite.save('comparison.png')
    print(f"Screenshots differ. Mean per-channel diff: {stat.mean}")
    print("Inspect the 'screenshot-comparison' workflow artifact.")
    print("If the change is acceptable, replace test/widget-sample.png with widget-01.png and commit.")
    raise SystemExit(1)
