import { combineRgb } from '@companion-module/base'
import { offset_cg, offset_fx_returns, offset_inputs, offset_mono_aux, offset_mono_groups, offset_mono_matrix, offset_mute_groups, offset_stereo_aux, offset_stereo_fx_sends, offset_stereo_matrix } from './constants'

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
					max: 128,
				},
			],
			callback: (feedback) => {
				// Adjust for 0-based index and protocol offset if necessary
				const index = feedback.options.strip - 1 + idOffset
				return this[storeArray][index] === 1
			},
		}
	}

	feedbacks['inputMute'] = createMuteFeedback('inputMute', 'Input', 'inputMuteState', offset_inputs)

	// Mono Group (1-48 in protocol) Stereo Group (1-24 in protocol)
	feedbacks['monoGroupMute'] = createMuteFeedback('monoGroupMute', 'MonoGroup', 'monoGroupMuteState', offset_mono_groups)
	feedbacks['stereoGroupMute'] = createMuteFeedback('stereoGroupMute', 'StereoGroup', 'stereoGroupMuteState', offset_mono_groups)

	// Aux
	feedbacks['monoAuxMute'] = createMuteFeedback('monoAuxMute', 'MonoAux', 'monoAuxMuteState', offset_mono_aux)
	feedbacks['stereoAuxMute'] = createMuteFeedback('stereoAuxMute', 'StereoAux', 'stereoAuxMuteState', offset_stereo_aux)

	// Matrix
	feedbacks['monoMatrixMute'] = createMuteFeedback('monoMatrixMute', 'Matrix', 'matrixMuteState', offset_mono_matrix)
	feedbacks['stereoMatrixMute'] = createMuteFeedback('stereoMatrixMute', 'StereoMatrix', 'stereoMatrixMuteState', offset_stereo_matrix)

	// FX
	feedbacks['monoFxSendMute'] = createMuteFeedback('monoFxSendMute', 'monoFX', 'monoFxSendMuteState', offset_mono_fx_sends)
	feedbacks['stereoFxSendMute'] = createMuteFeedback('stereoFxSendMute', 'stereoFX', 'stereoFxSendMuteState', offset_stereo_fx_sends)

	// FX Return
	feedbacks['fxReturnMute'] = createMuteFeedback('fxReturnMute', 'FX Return', 'fxReturnMuteState', offset_fx_returns)

	//area Outs
	feedbacks['areaOutsMute'] = createMuteFeedback('areaOutsMute', 'Area Out', 'areaOutMuteState', offset_mute_groups)

	//Control Groups (CG)
	feedbacks['controlGroupCGMute'] = createMuteFeedback('controlGroupCGMute', 'CG', 'dcaMuteState', offset_cg)

	//Mute Groups
	feedbacks['muteGroupMute'] = createMuteFeedback('muteGroupMute', 'Mute Group', 'muteGroupMuteState', offset_mute_groups)

	return feedbacks
}
