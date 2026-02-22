const { combineRgb } = require('@companion-module/base')
const {
	size_inputs,
	size_mono_groups,
	size_stereo_groups,
	size_mono_aux,
	size_stereo_aux,
	size_mono_matrix,
	size_stereo_matrix,
	size_mono_fx_sends,
	size_stereo_fx_sends,
	size_fx_returns,
	size_area_outs,
	size_cg,
	size_mute_groups,
	offset_inputs,
	offset_mono_groups,
	offset_stereo_groups,
	offset_mono_aux,
	offset_stereo_aux,
	offset_mono_matrix,
	offset_stereo_matrix,
	offset_mono_fx_sends,
	offset_stereo_fx_sends,
	offset_fx_returns,
	offset_area_outs,
	offset_cg,
	offset_mute_groups,
	channel_count,
	control_group_count,
	snapshot_count,
} = require('./constants')

// function getFeedbacks() {
// 	const feedbacks = {}

// 	const ColorWhite = combineRgb(255, 255, 255)
// 	const ColorRed = combineRgb(200, 0, 0)

// 	// Helper to generate generic mute feedback
// 	const createMuteFeedback = (id, label, storeArray, idOffset = 0) => {
// 		return {
// 			type: 'boolean',
// 			name: `Change background when ${label} is Muted`,
// 			description: `If the selected ${label} is muted, change the style of the button`,
// 			defaultStyle: {
// 				color: ColorWhite,
// 				bgcolor: ColorRed,
// 			},
// 			options: [
// 				{
// 					type: 'number', // Using number input for simplicity, or reuse your dropdown helpers
// 					label: `${label} Number`,
// 					id: 'strip',
// 					default: 1,
// 					min: 1,
// 					max: 128,
// 				},
// 			],
// 			callback: (feedback) => {
// 				// Adjust for 0-based index and protocol offset if necessary
// 				const index = feedback.options.strip - 1 + idOffset
// 				return this[storeArray][index] === 1
// 			},
// 		}
// 	}

// 	feedbacks['inputMute'] = createMuteFeedback('inputMute', 'Input', 'inputMuteState', offset_inputs)

// 	// Mono Group (1-48 in protocol) Stereo Group (1-24 in protocol)
// 	feedbacks['monoGroupMute'] = createMuteFeedback(
// 		'monoGroupMute',
// 		'MonoGroup',
// 		'monoGroupMuteState',
// 		offset_mono_groups,
// 	)
// 	feedbacks['stereoGroupMute'] = createMuteFeedback(
// 		'stereoGroupMute',
// 		'StereoGroup',
// 		'stereoGroupMuteState',
// 		offset_mono_groups,
// 	)

// 	// Aux
// 	feedbacks['monoAuxMute'] = createMuteFeedback('monoAuxMute', 'MonoAux', 'monoAuxMuteState', offset_mono_aux)
// 	feedbacks['stereoAuxMute'] = createMuteFeedback('stereoAuxMute', 'StereoAux', 'stereoAuxMuteState', offset_stereo_aux)

// 	// Matrix
// 	feedbacks['monoMatrixMute'] = createMuteFeedback('monoMatrixMute', 'Matrix', 'matrixMuteState', offset_mono_matrix)
// 	feedbacks['stereoMatrixMute'] = createMuteFeedback(
// 		'stereoMatrixMute',
// 		'StereoMatrix',
// 		'stereoMatrixMuteState',
// 		offset_stereo_matrix,
// 	)

// 	// FX
// 	feedbacks['monoFxSendMute'] = createMuteFeedback(
// 		'monoFxSendMute',
// 		'monoFX',
// 		'monoFxSendMuteState',
// 		offset_mono_fx_sends,
// 	)
// 	feedbacks['stereoFxSendMute'] = createMuteFeedback(
// 		'stereoFxSendMute',
// 		'stereoFX',
// 		'stereoFxSendMuteState',
// 		offset_stereo_fx_sends,
// 	)

// 	// FX Return
// 	feedbacks['fxReturnMute'] = createMuteFeedback('fxReturnMute', 'FX Return', 'fxReturnMuteState', offset_fx_returns)

// 	//area Outs
// 	feedbacks['areaOutsMute'] = createMuteFeedback('areaOutsMute', 'Area Out', 'areaOutMuteState', offset_area_outs)

// 	//Control Groups (CG)
// 	feedbacks['controlGroupCGMute'] = createMuteFeedback('controlGroupCGMute', 'CG', 'cgMuteState', offset_cg)

// 	//Mute Groups
// 	feedbacks['muteGroupMute'] = createMuteFeedback(
// 		'muteGroupMute',
// 		'Mute Group',
// 		'muteGroupMuteState',
// 		offset_mute_groups,
// 	)

// 	return feedbacks
// }



module.exports = function (self) {
	const feedbacks = {}
	const ColorWhite = combineRgb(255, 255, 255)
	const ColorRed = combineRgb(200, 0, 0)

	// Helper to generate generic mute feedback
	const createMuteFeedback = (id, label, storeArray) => {
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
					type: 'number',
					label: `${label} Number`,
					id: 'strip',
					default: 1,
					min: 1,
					max: 128,
				},
			],
			callback: (feedback) => {
				// 0-based index maps perfectly to our separated arrays
				const index = feedback.options.strip - 1 
                if (!self[storeArray]) return false;
				return self[storeArray][index] === 1
			},
		}
	}

	feedbacks['inputMute'] = createMuteFeedback('inputMute', 'Input', 'inputMuteState')
	feedbacks['monoGroupMute'] = createMuteFeedback('monoGroupMute', 'Mono Group', 'monoGroupMuteState')
	feedbacks['stereoGroupMute'] = createMuteFeedback('stereoGroupMute', 'Stereo Group', 'stereoGroupMuteState')
	feedbacks['monoAuxMute'] = createMuteFeedback('monoAuxMute', 'Mono Aux', 'monoAuxMuteState')
	feedbacks['stereoAuxMute'] = createMuteFeedback('stereoAuxMute', 'Stereo Aux', 'stereoAuxMuteState')
	feedbacks['monoMatrixMute'] = createMuteFeedback('monoMatrixMute', 'Mono Matrix', 'monoMatrixMuteState')
	feedbacks['stereoMatrixMute'] = createMuteFeedback('stereoMatrixMute', 'Stereo Matrix', 'stereoMatrixMuteState')
	feedbacks['monoFxSendMute'] = createMuteFeedback('monoFxSendMute', 'Mono FX Send', 'monoFxSendMuteState')
	feedbacks['stereoFxSendMute'] = createMuteFeedback('stereoFxSendMute', 'Stereo FX Send', 'stereoFxSendMuteState')
	feedbacks['fxReturnMute'] = createMuteFeedback('fxReturnMute', 'FX Return', 'fxReturnMuteState')
	feedbacks['areaOutsMute'] = createMuteFeedback('areaOutsMute', 'Area Out', 'areaOutsMuteState')
	feedbacks['controlGroupCGMute'] = createMuteFeedback('controlGroupCGMute', 'CG', 'cgMuteState')
	feedbacks['muteGroupMute'] = createMuteFeedback('muteGroupMute', 'Mute Group', 'muteGroupMuteState')

	return feedbacks
}