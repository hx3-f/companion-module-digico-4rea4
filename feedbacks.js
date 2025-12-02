import { combineRgb } from '@companion-module/base'

export function getFeedbacks() {
	const feedbacks = {}

	const ColorWhite = combineRgb(255, 255, 255)
	const ColorRed = combineRgb(200, 0, 0)

    // Helper to generate generic mute feedback
    const createMuteFeedback = (id, label, storeArray, idOffset = 0) => {
        return {
            type: 'boolean',
            name: `Change background when ${label} is Muted`,
            description: `If the selected ${label} is muted, change the style of the button`,
            defaultStyle: {
                color: ColorWhite,
                bgcolor: ColorRed,
            },
            options: [
                {
                    type: 'number', // Using number input for simplicity, or reuse your dropdown helpers
                    label: `${label} Number`,
                    id: 'strip',
                    default: 1,
                    min: 1,
                    max: 128
                },
            ],
            callback: (feedback) => {
                // Adjust for 0-based index and protocol offset if necessary
                const index = (feedback.options.strip - 1) + idOffset;
                return this[storeArray][index] === 1;
            },
        }
    }

	feedbacks['inputMute'] = createMuteFeedback('inputMute', 'Input', 'inputMuteState');
    
    // Mono Group (1-48 in protocol) Stereo Group (1-24 in protocol)
	feedbacks['monoGroupMute'] = createMuteFeedback('monoGroupMute', 'MonoGroup', 'monoGroupMuteState', 0);
    feedbacks['stereoGroupMute'] = createMuteFeedback('stereoGroupMute', 'StereoGroup', 'stereoGroupMuteState', 64);
    
    // Aux
	feedbacks['monoAuxMute'] = createMuteFeedback('monoAuxMute', 'MonoAux', 'monoAuxMuteState', 0);
    feedbacks['stereoAuxMute'] = createMuteFeedback('stereoAuxMute', 'StereoAux', 'stereoAuxMuteState', 64);
    
    // Matrix
	feedbacks['monoMatrixMute'] = createMuteFeedback('monoMatrixMute', 'Matrix', 'matrixMuteState', 0);
    feedbacks['stereoMatrixMute'] = createMuteFeedback('stereoMatrixMute', 'StereoMatrix', 'stereoMatrixMuteState', 64);

    // FX
	feedbacks['monoFxSendMute'] = createMuteFeedback('monoFxSendMute', 'monoFX', 'monoFxSendMuteState', 0);
    feedbacks['stereoFxSendMute'] = createMuteFeedback('stereoFxSendMute', 'stereoFX', 'stereoFxSendMuteState', 16);

    // FX Return
	feedbacks['fxSendMute'] = createMuteFeedback('fxSendMute', 'FX Send', 'fxSendMuteState', 32);

    //area Outs
    feedbacks['areaOutsMute'] = createMuteFeedback('areaOutsMute', 'Area Out', 'masterMuteState', 48);

    //Control Groups (CG)
    feedbacks['controlGroupCGMute'] = createMuteFeedback('controlGroupCGMute', 'Control Group (CG)', 'dcaMuteState', 54);

    //Mute Groups
    feedbacks['muteGroupMute'] = createMuteFeedback('muteGroupMute', 'Mute Group', 'muteGroupMuteState', 78);

	return feedbacks
}