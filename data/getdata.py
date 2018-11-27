import json

from allensdk.core.brain_observatory_cache import BrainObservatoryCache

def compress_roi(roi):
    mask = []

    for i, row in enumerate(roi):
        for j, flag in enumerate(row):
            if flag:
                mask.append((i, j))

    return mask


def sample(signal, n):
    size = int(len(signal) / n)
    extra = len(signal) % size

    sampled = []
    for i in range(n):
        sampled.append(sum(signal[i*size:(i+1)*size]) / size)

    if extra > 0:
        sampled.append(sum(signal[n*size:]) / extra)

    return sampled

# Create a brain observatory.
manifest_file = './brain_observatory_manifest.json'
boc = BrainObservatoryCache(manifest_file=manifest_file)

# Select a visual area and a Cre line.
visual_area = 'VISal'
cre_line ='Cux2-CreERT2'

# Extract experiments.
exps = boc.get_experiment_containers(targeted_structures=[visual_area], cre_lines=[cre_line])

# Select one experiment.
experiment_container_id = 511510736

# Extract a session.
session_id = boc.get_ophys_experiments(experiment_container_ids=[experiment_container_id], stimuli=['natural_scenes'])[0]['id']

# Extract the full dataset for that session.
dataset = boc.get_ophys_experiment_data(ophys_experiment_id=session_id)

# Pull out the max intensity projection.
mip = dataset.get_max_projection()

# Pull out the ROI masks.
rois = dataset.get_roi_mask_array()

# Get timestamps and Dff data.
ts, dff = dataset.get_dff_traces()

# Pull out the stimulus epoch data.
stim_epoch = dataset.get_stimulus_epoch_table()

# Dump all the data out into data files.
with open('mip.json', 'w') as f:
    f.write(json.dumps(mip.tolist()))

with open('rois.json', 'w') as f:
    f.write(json.dumps(list(map(compress_roi, rois.tolist()))))

with open('dff.json', 'w') as f:
    # f.write(json.dumps(dff.tolist()))
    f.write(json.dumps(list(map(lambda x: sample(x, 2000), dff.tolist()))))

with open('stim_epoch.json', 'w') as f:
    f.write(stim_epoch.to_json())
