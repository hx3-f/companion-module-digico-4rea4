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
    
    // Note: For Groups/Aux/Matrix, the protocol separates Mono (0-63) and Stereo (64+)
    // You might want separate feedbacks or a smart one that detects the range. 
    // This example assumes simple index mapping matching your action options.
    
    // Mono Group (0-61 in protocol)
	feedbacks['groupMute'] = createMuteFeedback('groupMute', 'Group', 'groupMuteState');
    
    // Aux
	feedbacks['auxMute'] = createMuteFeedback('auxMute', 'Aux', 'auxMuteState');
    
    // Matrix
	feedbacks['matrixMute'] = createMuteFeedback('matrixMute', 'Matrix', 'matrixMuteState');

    // DCA (Protocol 0x36 start, handled in processIncomingData logic)
	feedbacks['dcaMute'] = createMuteFeedback('dcaMute', 'DCA', 'dcaMuteState');

    // FX Send (Protocol combines Mono/Stereo, handled in processIncomingData)
	feedbacks['fxSendMute'] = createMuteFeedback('fxSendMute', 'FX Send', 'fxSendMuteState');

	return feedbacks
}