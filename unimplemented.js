//UFX modules are not implemented in 4rea4, but leaving actions here for future use if needed
//index.js

actions['fader_ufx_send'] = {
	name: 'Set UFX Stereo Send Fader to Level',
	options: this.faderOptions('UFX Stereo Send', 8, 0x55),
	callback: async (action) => {
		this.sendAction('fader_ufx_send', action.options)
	},
}
actions['fader_ufx_return'] = {
	name: 'Set UFX Stereo Return Fader to Level',
	options: this.faderOptions('UFX Stereo Return', 8, 0x5d),
	callback: async (action) => {
		this.sendAction('fader_ufx_return', action.options)
	},
}

actions['mute_ufx_send'] = {
	name: 'Mute UFX Stereo Send',
	options: this.muteOptions('UFX Stereo Send', 8, 0x55),
	callback: async (action) => {
		this.sendAction('mute_ufx_send', action.options)
	},
}
actions['mute_ufx_return'] = {
	name: 'Mute UFX Stereo Return',
	options: this.muteOptions('UFX Stereo Return', 8, 0x5d),
	callback: async (action) => {
		this.sendAction('mute_ufx_return', action.options)
	},
}

// UFX Send Level Controls
actions['send_ufx'] = {
	name: 'Set UFX Stereo Send Level',
	options: this.sendLevelOptions('UFX Stereo Send', 8, 0x55),
	callback: async (action) => {
		this.sendAction('send_ufx', action.options)
	},
}

// UFX Global Key Control
this.CHOICES_UFX_KEY = [
	{ label: 'C', id: 0x00 },
	{ label: 'C#', id: 0x01 },
	{ label: 'D', id: 0x02 },
	{ label: 'D#', id: 0x03 },
	{ label: 'E', id: 0x04 },
	{ label: 'F', id: 0x05 },
	{ label: 'F#', id: 0x06 },
	{ label: 'G', id: 0x07 },
	{ label: 'G#', id: 0x08 },
	{ label: 'A', id: 0x09 },
	{ label: 'A#', id: 0x0a },
	{ label: 'B', id: 0x0b },
]

actions['ufx_global_key'] = {
	name: 'Set UFX Global Key',
	options: [
		{
			type: 'dropdown',
			label: 'Key',
			id: 'key',
			default: 0x00,
			choices: this.CHOICES_UFX_KEY,
		},
	],
	callback: async (action) => {
		this.sendAction('ufx_global_key', action.options)
	},
}

// UFX Global Scale Control
this.CHOICES_UFX_SCALE = [
	{ label: 'Major', id: 0x00 },
	{ label: 'Minor', id: 0x01 },
]

actions['ufx_global_scale'] = {
	name: 'Set UFX Global Scale',
	options: [
		{
			type: 'dropdown',
			label: 'Scale',
			id: 'scale',
			default: 0x00,
			choices: this.CHOICES_UFX_SCALE,
		},
	],
	callback: async (action) => {
		this.sendAction('ufx_global_scale', action.options)
	},
}

// UFX Unit Parameter Control
actions['ufx_unit_parameter'] = {
	name: 'Set UFX Unit Parameter',
	options: [
		{
			type: 'number',
			label: 'UFX MIDI Channel (M)',
			id: 'midiChannel',
			default: 1,
			min: 1,
			max: 16,
		},
		{
			type: 'number',
			label: 'Control Number (nn)',
			id: 'controlNumber',
			default: 1,
			min: 0,
			max: 127,
		},
		{
			type: 'number',
			label: 'Value (vv)',
			id: 'value',
			default: 0,
			min: 0,
			max: 127,
		},
	],
	callback: async (action) => {
		this.sendAction('ufx_unit_parameter', action.options)
	},
}

// UFX Unit Key Parameter (with CC value scaling)
actions['ufx_unit_key'] = {
	name: 'Set UFX Unit Key Parameter',
	options: [
		{
			type: 'number',
			label: 'UFX MIDI Channel (M)',
			id: 'midiChannel',
			default: 1,
			min: 1,
			max: 16,
		},
		{
			type: 'number',
			label: 'Control Number (nn)',
			id: 'controlNumber',
			default: 1,
			min: 0,
			max: 127,
		},
		{
			type: 'dropdown',
			label: 'Key',
			id: 'key',
			default: 'C',
			choices: [
				{ label: 'C', id: 'C' },
				{ label: 'C#', id: 'C#' },
				{ label: 'D', id: 'D' },
				{ label: 'D#', id: 'D#' },
				{ label: 'E', id: 'E' },
				{ label: 'F', id: 'F' },
				{ label: 'F#', id: 'F#' },
				{ label: 'G', id: 'G' },
				{ label: 'G#', id: 'G#' },
				{ label: 'A', id: 'A' },
				{ label: 'A#', id: 'A#' },
				{ label: 'B', id: 'B' },
			],
		},
	],
	callback: async (action) => {
		this.sendAction('ufx_unit_key', action.options)
	},
}

// UFX Unit Scale Parameter (with CC value scaling)
actions['ufx_unit_scale'] = {
	name: 'Set UFX Unit Scale Parameter',
	options: [
		{
			type: 'number',
			label: 'UFX MIDI Channel (M)',
			id: 'midiChannel',
			default: 1,
			min: 1,
			max: 16,
		},
		{
			type: 'number',
			label: 'Control Number (nn)',
			id: 'controlNumber',
			default: 1,
			min: 0,
			max: 127,
		},
		{
			type: 'dropdown',
			label: 'Scale',
			id: 'scale',
			default: 'Major',
			choices: [
				{ label: 'Major', id: 'Major' },
				{ label: 'Minor', id: 'Minor' },
				{ label: 'Chromatic', id: 'Chromatic' },
			],
		},
	],
	callback: async (action) => {
		this.sendAction('ufx_unit_scale', action.options)
	},
}

//actions.js

// case 'send_ufx':
// 	// SysEx messages for send levels
// 	let inputCh = parseInt(opt.inputChannel)
// 	let sendCh = parseInt(opt.send)
// 	let sendLevel = parseInt(opt.level)
// 	let sendType = 0x01 // Default for aux sends

// 	if (actionId.includes('fx') && !actionId.includes('ufx')) {
// 		sendType = 0x02 // FX sends
// 	} else if (actionId.includes('matrix')) {
// 		sendType = 0x03 // Matrix sends
// 	} else if (actionId.includes('ufx')) {
// 		sendType = 0x04 // UFX sends
// 	}

// 	cmd.buffers = [
// 		Buffer.from([0xf0, 0, 0, 0x1a, 0x50, 0x10, 0x01, 0, 0, sendType, inputCh, sendCh, sendLevel, 0xf7]),
// 	]
// 	break

// case 'ufx_global_key':
// 	// Control Change message for UFX Global Key (BN, 0C, Key)
// 	cmd.buffers = [Buffer.from([0xb0 + (this.config.midiChannel || 0), 0x0c, parseInt(opt.key)])]
// 	break

// case 'ufx_global_scale':
// 	// Control Change message for UFX Global Scale (BN, 0D, Scale)
// 	cmd.buffers = [Buffer.from([0xb0 + (this.config.midiChannel || 0), 0x0d, parseInt(opt.scale)])]
// 	break

// case 'ufx_unit_parameter':
// 	// Control Change message for UFX Unit Parameter (BM, nn, vv)
// 	let midiCh = parseInt(opt.midiChannel) - 1 // Convert to 0-based
// 	cmd.buffers = [Buffer.from([0xb0 + midiCh, parseInt(opt.controlNumber), parseInt(opt.value)])]
// 	break

// case 'ufx_unit_key':
// 	// Control Change message for UFX Unit Key Parameter with CC value scaling
// 	let keyMidiCh = parseInt(opt.midiChannel) - 1 // Convert to 0-based
// 	let controlNum = parseInt(opt.controlNumber)

// 	// Map key to CC value range (refer to protocol table)
// 	let keyMapping = {
// 		C: 5, // Mid-range value for C (0-10 range)
// 		'C#': 16, // Mid-range value for C# (11-21 range)
// 		D: 26, // Mid-range value for D (22-31 range)
// 		'D#': 37, // Mid-range value for D# (32-42 range)
// 		E: 47, // Mid-range value for E (43-52 range)
// 		F: 58, // Mid-range value for F (53-63 range)
// 		'F#': 69, // Mid-range value for F# (64-74 range)
// 		G: 79, // Mid-range value for G (75-84 range)
// 		'G#': 90, // Mid-range value for G# (85-95 range)
// 		A: 100, // Mid-range value for A (96-105 range)
// 		'A#': 111, // Mid-range value for A# (106-116 range)
// 		B: 122, // Mid-range value for B (117-127 range)
// 	}

// 	let keyValue = keyMapping[opt.key] || 5
// 	cmd.buffers = [Buffer.from([0xb0 + keyMidiCh, controlNum, keyValue])]
// 	break

// case 'ufx_unit_scale':
// 	// Control Change message for UFX Unit Scale Parameter with CC value scaling
// 	let scaleMidiCh = parseInt(opt.midiChannel) - 1 // Convert to 0-based
// 	let scaleControlNum = parseInt(opt.controlNumber)

// 	// Map scale to CC value range (refer to protocol table)
// 	let scaleMapping = {
// 		Major: 21, // Mid-range value for Major (0-42 range)
// 		Minor: 63, // Mid-range value for Minor (43-84 range)
// 		Chromatic: 106, // Mid-range value for Chromatic (85-127 range)
// 	}

// 	let scaleValue = scaleMapping[opt.scale] || 21
// 	cmd.buffers = [Buffer.from([0xb0 + scaleMidiCh, scaleControlNum, scaleValue])]
// 	break
