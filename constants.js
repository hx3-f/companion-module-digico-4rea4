// //define variables for all Channel sizes
// export const size_inputs = 128
// export const size_mono_groups = 48
// export const size_stereo_groups = 24
// export const size_mono_aux = 48
// export const size_stereo_aux = 24
// export const size_mono_matrix = 48
// export const size_stereo_matrix = 24
// export const size_mono_fx_sends = 16
// export const size_stereo_fx_sends = 16
// export const size_fx_returns = 16
// export const size_area_outs = 4
// export const size_cg = 24
// export const size_mute_groups = 8

// export const offset_inputs = -1
// export const offset_mono_groups = -1
// export const offset_stereo_groups = 0x40 - 1
// export const offset_mono_aux = -1
// export const offset_stereo_aux = 0x40 - 1
// export const offset_mono_matrix = -1
// export const offset_stereo_matrix = 0x40 - 1
// export const offset_mono_fx_sends = -1
// export const offset_stereo_fx_sends = 0x10 - 1
// export const offset_fx_returns = 0x20 - 1
// export const offset_area_outs = 0x30 - 1
// export const offset_cg = 0x36 - 1
// export const offset_mute_groups = 0x40 - 1
// export const channel_count = 128
// export const control_group_count = 48
// export const snapshot_count = 800

// // dBu Decimal Mapping Array
// export const dbu_Values = [
// 	'-inf',
// 	'-47.5',
// 	'-47.1',
// 	'-46.6',
// 	'-46.2',
// 	'-45.7',
// 	'-45.3',
// 	'-44.8',
// 	'-44.3',
// 	'-43.9',
// 	'-43.4',
// 	'-43.0',
// 	'-42.5',
// 	'-42.1',
// 	'-41.6',
// 	'-41.1',
// 	'-40.7',
// 	'-40.2',
// 	'-39.8',
// 	'-39.3',
// 	'-38.9',
// 	'-38.4',
// 	'-38.0',
// 	'-37.5',
// 	'-37.0',
// 	'-36.6',
// 	'-36.1',
// 	'-35.7',
// 	'-35.2',
// 	'-34.8',
// 	'-34.3',
// 	'-33.8',
// 	'-33.4',
// 	'-32.9',
// 	'-32.5',
// 	'-32.0',
// 	'-31.6',
// 	'-31.1',
// 	'-30.6',
// 	'-30.2',
// 	'-29.7',
// 	'-29.3',
// 	'-28.8',
// 	'-28.4',
// 	'-27.9',
// 	'-27.4',
// 	'-27.0',
// 	'-26.5',
// 	'-26.1',
// 	'-25.6',
// 	'-25.2',
// 	'-24.7',
// 	'-24.3',
// 	'-23.8',
// 	'-23.3',
// 	'-22.9',
// 	'-22.4',
// 	'-22.0',
// 	'-21.5',
// 	'-21.1',
// 	'-20.6',
// 	'-20.1',
// 	'-19.7',
// 	'-19.2',
// 	'-18.8',
// 	'-18.3',
// 	'-17.9',
// 	'-17.4',
// 	'-16.9',
// 	'-16.5',
// 	'-16.0',
// 	'-15.6',
// 	'-15.1',
// 	'-14.7',
// 	'-14.2',
// 	'-13.7',
// 	'-13.3',
// 	'-12.8',
// 	'-12.4',
// 	'-11.9',
// 	'-11.5',
// 	'-11.0',
// 	'-10.6',
// 	'-10.1',
// 	'-9.6',
// 	'-9.2',
// 	'-8.7',
// 	'-8.3',
// 	'-7.8',
// 	'-7.4',
// 	'-6.9',
// 	'-6.4',
// 	'-6.0',
// 	'-5.5',
// 	'-5.1',
// 	'-4.6',
// 	'-4.2',
// 	'-3.7',
// 	'-3.2',
// 	'-2.8',
// 	'-2.3',
// 	'-1.9',
// 	'-1.4',
// 	'-1.0',
// 	'-0.5',
// 	'0.0',
// 	'+0.4',
// 	'+0.9',
// 	'+1.3',
// 	'+1.8',
// 	'+2.2',
// 	'+2.7',
// 	'+3.1',
// 	'+3.6',
// 	'+4.1',
// 	'+4.5',
// 	'+5.0',
// 	'+5.4',
// 	'+5.9',
// 	'+6.3',
// 	'+6.8',
// 	'+7.3',
// 	'+7.7',
// 	'+8.2',
// 	'+8.6',
// 	'+9.1',
// 	'+9.5',
// 	'+10.0',
// ]

// Define variables for all Channel sizes
const size_inputs = 128
const size_mono_groups = 48
const size_stereo_groups = 24
const size_mono_aux = 48
const size_stereo_aux = 24
const size_mono_matrix = 48
const size_stereo_matrix = 24
const size_mono_fx_sends = 16
const size_stereo_fx_sends = 16
const size_fx_returns = 16
const size_area_outs = 4
const size_cg = 24
const size_mute_groups = 8

const offset_inputs = -1
const offset_mono_groups = -1
const offset_stereo_groups = 0x40 - 1
const offset_mono_aux = -1
const offset_stereo_aux = 0x40 - 1
const offset_mono_matrix = -1
const offset_stereo_matrix = 0x40 - 1
const offset_mono_fx_sends = -1
const offset_stereo_fx_sends = 0x10 - 1
const offset_fx_returns = 0x20 - 1
const offset_area_outs = 0x30 - 1
const offset_cg = 0x36 - 1
const offset_mute_groups = 0x40 - 1
const channel_count = 128
const control_group_count = 48
const snapshot_count = 800

// dBu Decimal Mapping Array
const dbu_Values = [
	'-inf',
	'-47.5',
	'-47.1',
	'-46.6',
	'-46.2',
	'-45.7',
	'-45.3',
	'-44.8',
	'-44.3',
	'-43.9',
	'-43.4',
	'-43.0',
	'-42.5',
	'-42.1',
	'-41.6',
	'-41.1',
	'-40.7',
	'-40.2',
	'-39.8',
	'-39.3',
	'-38.9',
	'-38.4',
	'-38.0',
	'-37.5',
	'-37.0',
	'-36.6',
	'-36.1',
	'-35.7',
	'-35.2',
	'-34.8',
	'-34.3',
	'-33.8',
	'-33.4',
	'-32.9',
	'-32.5',
	'-32.0',
	'-31.6',
	'-31.1',
	'-30.6',
	'-30.2',
	'-29.7',
	'-29.3',
	'-28.8',
	'-28.4',
	'-27.9',
	'-27.4',
	'-27.0',
	'-26.5',
	'-26.1',
	'-25.6',
	'-25.2',
	'-24.7',
	'-24.3',
	'-23.8',
	'-23.3',
	'-22.9',
	'-22.4',
	'-22.0',
	'-21.5',
	'-21.1',
	'-20.6',
	'-20.1',
	'-19.7',
	'-19.2',
	'-18.8',
	'-18.3',
	'-17.9',
	'-17.4',
	'-16.9',
	'-16.5',
	'-16.0',
	'-15.6',
	'-15.1',
	'-14.7',
	'-14.2',
	'-13.7',
	'-13.3',
	'-12.8',
	'-12.4',
	'-11.9',
	'-11.5',
	'-11.0',
	'-10.6',
	'-10.1',
	'-9.6',
	'-9.2',
	'-8.7',
	'-8.3',
	'-7.8',
	'-7.4',
	'-6.9',
	'-6.4',
	'-6.0',
	'-5.5',
	'-5.1',
	'-4.6',
	'-4.2',
	'-3.7',
	'-3.2',
	'-2.8',
	'-2.3',
	'-1.9',
	'-1.4',
	'-1.0',
	'-0.5',
	'0.0',
	'+0.4',
	'+0.9',
	'+1.3',
	'+1.8',
	'+2.2',
	'+2.7',
	'+3.1',
	'+3.6',
	'+4.1',
	'+4.5',
	'+5.0',
	'+5.4',
	'+5.9',
	'+6.3',
	'+6.8',
	'+7.3',
	'+7.7',
	'+8.2',
	'+8.6',
	'+9.1',
	'+9.5',
	'+10.0',
]

// Export everything for CommonJS (Node.js/Companion)
module.exports = {
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
	dbu_Values
}