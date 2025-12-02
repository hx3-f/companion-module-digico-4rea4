/**
 *
 * Companion instance class for the DiGiCo 4rea4 line of consoles.
 * @version 1.0.4+alpha
 *
 */

const { InstanceBase, Regex, runEntrypoint, TCPHelper } = require('@companion-module/base')
const actions = require('./actions')
const upgradeScripts = require('./upgrade')
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
	scene_count,
} = require('./constants')
const TIME_BETW_MULTIPLE_REQ_MS = 150

/**
 * @extends InstanceBase
 * @since 2.0.0
 */

class ModuleInstance extends InstanceBase {
	/**
	 * Create an instance.
	 *
	 * @param {unknown} internal - the internal instance object
	 * @since 2.0.0
	 */
	constructor(internal) {
		super(internal)

		Object.assign(this, {
			...actions,
		})
	}

	/**
	 * Setup the actions.
	 *
	 * @access public
	 * @since 2.0.0
	 */
	updateActions() {
		this.setActionDefinitions(this.getActionDefinitions())
	}

	setRouting(ch, selArray, isMute) {
		let routingCmds = []
		let start = isMute ? control_group_count : 0
		let qty = isMute ? 8 : control_group_count
		let chOfs = 0
		for (let i = start; i < start + qty; i++) {
			let grpCode = i + (selArray.includes(`${i - start}`) ? 0x40 : 0)
			routingCmds.push(Buffer.from([0xb0, 0x63, ch + chOfs, 0xb0, 0x62, 0x40, 0xb0, 0x06, grpCode]))
		}

		return routingCmds
	}

	/**
	 * Executes the provided action.
	 *
	 * @param {string} actionId - the action ID to be executed
	 * @param {Object} options - the action options
	 * @access public
	 * @since 2.0.0
	 */
	sendAction(actionId, options) {
		let opt = options
		let channel = parseInt(opt.inputChannel)
		let chOfs = 0
		let strip = parseInt(opt.strip)
		let cmd = { port: this.config.midiPort, buffers: [] }

		switch (
			actionId // Note that only available actions for the type (TCP or MIDI) will be processed
		) {
			case 'mute_input':
			case 'mute_mix':
				chOfs = 0
				break

			case 'mute_mono_group':
			case 'mute_stereo_group':
				chOfs = 1
				break

			case 'mute_mono_aux':
			case 'mute_stereo_aux':
				chOfs = 2
				break

			case 'mute_mono_matrix':
			case 'mute_stereo_matrix':
				chOfs = 3
				break

			case 'mute_mono_fx_send':
			case 'mute_stereo_fx_send':
			case 'mute_fx_return':
			case 'mute_cg':
			case 'mute_area_outs':
			// case 'mute_ufx_send':
			// // case 'mute_ufx_return':
			// 	chOfs = 4
			// 	break

			case 'fader_input':
			case 'fader_mix':
				chOfs = 0
				break

			case 'fader_mono_group':
			case 'fader_stereo_group':
				chOfs = 1
				break

			case 'fader_mono_aux':
			case 'fader_stereo_aux':
				chOfs = 2
				break

			case 'fader_mono_matrix':
			case 'fader_stereo_matrix':
				chOfs = 3
				break

			case 'fader_CG':
			case 'fader_mono_fx_send':
			case 'fader_stereo_fx_send':
			case 'fader_fx_return':
			// case 'fader_ufx_send':
			// case 'fader_ufx_return':
			// 	chOfs = 4
			// 	break

			case 'phantom':
				cmd.buffers = [
					Buffer.from([0xf0, 0, 0, 0x1a, 0x50, 0x10, 0x01, 0, 0, 0x0c, strip, opt.phantom ? 0x7f : 0, 0xf7]),
				]
				break

			case 'cg_assign':
				cmd.buffers = this.setRouting(channel, opt.cgGroup, false)
				break

			case 'mute_assign':
				cmd.buffers = this.setRouting(channel, opt.muteGroup, true)
				break

			case 'scene_recall':
				let sceneNumber = parseInt(opt.sceneNumber)
				cmd.buffers = [Buffer.from([0xb0, 0, (sceneNumber >> 7) & 0x0f, 0xc0, sceneNumber & 0x7f])]
				break

			case 'scene_next':
				cmd.buffers = [Buffer.from([0xb0, 0x77, 0x7f])] // Control Change for Scene Next
				break

			case 'scene_previous':
				cmd.buffers = [Buffer.from([0xb0, 0x76, 0x7f])] // Control Change for Scene Previous
				break

			case 'solo_input':
				cmd.buffers = [Buffer.from([0xb0, 0x73, strip, 0xb0, 0x26, opt.solo ? 0x7f : 0x00])]
				break

			case 'eq_enable_input':
				// NRPN message for EQ Enable/Disable
				cmd.buffers = [Buffer.from([0xb0, 0x63, strip, 0xb0, 0x62, 0x01, 0xb0, 0x06, opt.enable ? 0x7f : 0x00])]
				break

			case 'preamp_gain':
				// Pitchbend message for preamp gain (14-bit value)
				let gainValue = parseInt(opt.gain)
				let lsb = gainValue & 0x7f
				let msb = (gainValue >> 7) & 0x7f
				cmd.buffers = [Buffer.from([0xe0, lsb, msb])]
				break

			case 'preamp_pad':
				cmd.buffers = [Buffer.from([0xf0, 0, 0, 0x1a, 0x50, 0x10, 0x01, 0, 0, 0x0d, strip, opt.pad ? 0x7f : 0, 0xf7])]
				break

			case 'hpf_control':
				// NRPN message for HPF control
				cmd.buffers = [Buffer.from([0xb0, 0x63, strip, 0xb0, 0x62, 0x02, 0xb0, 0x06, parseInt(opt.frequency)])]
				break

			case 'input_to_main':
				// NRPN message for Input to Main assignment
				cmd.buffers = [Buffer.from([0xb0, 0x63, strip, 0xb0, 0x62, 0x03, 0xb0, 0x06, opt.assign ? 0x7f : 0x00])]
				break

			case 'send_aux_mono':
			case 'send_aux_stereo':
			case 'send_fx_mono':
			case 'send_fx_stereo':
			case 'send_matrix_mono':
			case 'send_matrix_stereo':
			case 'send_mix':
			case 'send_fx':
			//UFX Cases
			//NOT IMPLEMENTED IN 4REA4
			case 'talkback_on':
				cmd = {
					port: this.config.tcpPort,
					buffers: [Buffer.from([0xf0, 0, 2, 0, 0x4b, 0, 0x4a, 0x10, 0xe7, 0, 1, opt.on ? 1 : 0, 0xf7])],
				}
				break

			case 'vsc':
				cmd = {
					port: this.config.tcpPort,
					buffers: [Buffer.from([0xf0, 0, 2, 0, 0x4b, 0, 0x4a, 0x10, 0x8a, 0, 1, opt.vscMode, 0xf7])],
				}
		}

		if (cmd.buffers.length == 0) {
			// Mute or Fader Level actions
			if (actionId.slice(0, 4) == 'mute') {
				cmd.buffers = [Buffer.from([0x90 + chOfs, strip, opt.mute ? 0x7f : 0x3f, 0x90 + chOfs, strip, 0])]
			} else {
				let faderLevel = parseInt(opt.level)
				cmd.buffers = [Buffer.from([0xb0 + chOfs, 0x63, strip, 0x62, 0x17, 0x06, faderLevel])]
			}
		}

		// console.log(cmd);

		for (let i = 0; i < cmd.buffers.length; i++) {
			if (cmd.port === this.config.midiPort && this.midiSocket !== undefined) {
				this.log(
					'debug',
					`sending ${cmd.buffers[i].toString('hex')} via MIDI @${this.config.host}:${this.config.midiPort}`,
				)
				this.midiSocket.send(cmd.buffers[i]).catch((e) => {
					this.log('error', `MIDI send error: ${e.message}`)
				})
			} else if (this.tcpSocket !== undefined) {
				this.log(
					'debug',
					`sending ${cmd.buffers[i].toString('hex')} via TCP @${this.config.host}:${this.config.tcpPort}`,
				)
				this.tcpSocket.send(cmd.buffers[i]).catch((e) => {
					this.log('error', `TCP send error: ${e.message}`)
				})
			}
		}
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 2.0.0
	 */
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module is for the DiGiCo 4rea4 line of consoles.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				default: '192.168.1.70',
				regex: Regex.IP,
			},
			{
				type: 'dropdown',
				id: 'model',
				label: 'Console Type',
				width: 6,
				default: '4rea4',
				choices: [{ id: '4rea4', label: '4rea4' }],
			},
			{
				type: 'number',
				id: 'midiPort',
				label: 'MIDI Port',
				width: 6,
				default: 51325, //changed from 51321
				min: 1,
				max: 65535,
			},
			//TODO: verify tcp port for 4rea4 (and existence)
			{
				type: 'number',
				id: 'tcpPort',
				label: 'TCP Port',
				width: 6,
				default: 51321,
				min: 1,
				max: 65535,
			},
			{
				type: 'number',
				id: 'midiChannel',
				label: 'MIDI Channel for 4rea4 System (N)',
				width: 6,
				default: 0,
				min: 0,
				max: 15,
			},
		]
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 2.0.0
	 */
	async destroy() {
		if (this.tcpSocket !== undefined) {
			this.tcpSocket.destroy()
		}

		if (this.midiSocket !== undefined) {
			this.midiSocket.destroy()
		}

		this.log('debug', `destroyed ${this.id}`)
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.2.0
	 */
	async init() {
		// Initialize with current config or empty object if not set yet
		await this.configUpdated(this.config || {})
		this.inputMuteState = new Array(size_inputs).fill(0)
		this.groupMuteState = new Array(size_mono_groups + size_stereo_groups).fill(0) // Covers Mono and Stereo Groups
		this.auxMuteState = new Array(size_mono_aux + size_stereo_aux).fill(0) // Covers Mono and Stereo Auxes
		this.matrixMuteState = new Array(size_mono_matrix + size_stereo_matrix).fill(0) // Covers Mono and Stereo Matrix
		this.fxSendMuteState = new Array(size_mono_fx_sends + size_stereo_fx_sends).fill(0) // Covers Mono and Stereo FX Sends
		this.fxReturnMuteState = new Array(size_fx_returns).fill(0)
		this.cgMuteState = new Array(size_cg).fill(0)
		this.muteGroupMuteState = new Array(size_mute_groups).fill(0)
		this.areaOutsMuteState = new Array(size_area_outs).fill(0) // For Mains/Area Out
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 2.0.0
	 */
	init_tcp() {
		if (this.tcpSocket !== undefined) {
			this.tcpSocket.destroy()
			delete this.tcpSocket
		}

		if (this.midiSocket !== undefined) {
			this.midiSocket.destroy()
			delete this.midiSocket
		}

		if (this.config.host) {
			this.midiSocket = new TCPHelper(this.config.host, this.config.midiPort)

			this.midiSocket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.midiSocket.on('error', (err) => {
				this.log('error', 'MIDI error: ' + err.message)
			})

			this.midiSocket.on('connect', () => {
				this.log('debug', `MIDI Connected to ${this.config.host}`)
			})

			if (this.config.model == '4rea4') {
				this.tcpSocket = new TCPHelper(this.config.host, this.config.tcpPort)

				this.tcpSocket.on('status_change', (status, message) => {
					this.updateStatus(status, message)
				})

				this.tcpSocket.on('error', (err) => {
					this.log('error', 'TCP error: ' + err.message)
				})

				this.tcpSocket.on('connect', () => {
					this.log('debug', `TCP Connected to ${this.config.host}`)
				})
			}
			if (this.config.host) {
				this.midiSocket = new TCPHelper(this.config.host, this.config.midiPort)

				this.midiSocket.on('status_change', (status, message) => {
					this.updateStatus(status, message)
				})

				this.midiSocket.on('error', (err) => {
					this.log('error', 'MIDI error: ' + err.message)
				})

				this.midiSocket.on('data', (data) => {
					this.processIncomingData(data)
				})

				this.midiSocket.on('connect', () => {
					this.log('debug', `MIDI Connected to ${this.config.host}`)
					this.updateStatus(InstanceStatus.Ok)
				})
			}
		}
	}
	async performReadoutAfterConnected() {
		await this.pollAllMonitoredFeedbacks()

		// get input info
		let unitInAmount = this.numberOfInputs
		for (let index = 1; index <= unitInAmount; index++) {
			this.requestMuteInfo(Constants.ChannelType.Input, index)
			await this.sleep(TIME_BETW_MULTIPLE_REQ_MS)
			this.requestLevelInfo(Constants.ChannelType.Input, index)
			await this.sleep(TIME_BETW_MULTIPLE_REQ_MS)
		}
		// get zone info
		let unitZonesAmount = this.numberOfZones
		for (let index = 1; index <= unitZonesAmount; index++) {
			this.requestMuteInfo(Constants.ChannelType.Zone, index)
			await this.sleep(TIME_BETW_MULTIPLE_REQ_MS)
			this.requestLevelInfo(Constants.ChannelType.Zone, index)
			await this.sleep(TIME_BETW_MULTIPLE_REQ_MS)
		}
	}

	requestMuteInfo(chType, chNumber) {
		if (Helpers.checkIfValueOfEnum(chType, Constants.ChannelType) == false) {
			return
		}

		let buffer = [
			Buffer.from([
				0xf0,
				0x00,
				0x00,
				0x1a,
				0x50,
				0x12,
				0x01,
				0x00,
				parseInt(chType),
				0x01,
				0x09,
				parseInt(chNumber) - 1,
				0xf7,
			]),
		]
		this.sendCommand(buffer)
	}

	requestSendMuteInfo(sendType, chNumber, sendChNumber) {
		if (Helpers.checkIfValueOfEnum(sendType, Constants.SendType) == false) {
			return
		}

		// get types of send
		let chType = Helpers.getChTypeOfSendType(sendType)
		let sendChType = Helpers.getSendChTypeOfSendType(sendType)

		console.log(
			`requestSendMuteInfo: chType: ${chType}, ch: ${chNumber}, sendChType: ${sendChType}, sendChNumber: ${sendChNumber}`,
		)

		let buffer = [
			Buffer.from([
				0xf0,
				0x00,
				0x00,
				0x1a,
				0x50,
				0x12,
				0x01,
				0x00,
				parseInt(chType),
				0x01,
				0x0f,
				0x03,
				parseInt(chNumber) - 1,
				parseInt(sendChType),
				parseInt(sendChNumber) - 1,
				0xf7,
			]),
		]
		this.sendCommand(buffer)
	}

	requestLevelInfo(chType, chNumber) {
		if (Helpers.checkIfValueOfEnum(chType, Constants.ChannelType) == false) {
			return
		}

		let buffer = [
			Buffer.from([
				0xf0,
				0x00,
				0x00,
				0x1a,
				0x50,
				0x12,
				0x01,
				0x00,
				parseInt(chType),
				0x01,
				0x0b,
				0x17,
				parseInt(chNumber) - 1,
				0xf7,
			]),
		]
		this.sendCommand(buffer)
	}
	processIncomingData(data) {
		for (let i = 0; i < data.length; i++) {
			let byte = data[i]

			// Check for Note On messages (0x90 - 0x9F)
			// Assuming MIDI Channel N = 0 (Default). Adjust logic if N > 0.
			if (byte >= 0x90 && byte <= 0x94) {
				if (byte == 0) {
					break // Prevent out-of-bounds access
				} else {
					byte = 0
				}
			}
			let midiChannel = byte & 0x0f
			let note = data[i + 1]
			let velocity = data[i + 2]

			// 4rea4 Spec: Velocity > 0x40 is Mute ON, < 0x40 is Mute OFF
			let isMuted = velocity >= 0x40 ? 1 : 0

			// Handle based on MIDI Channel (N=0)
			//offsets handled in feedbacks.js
			//TODO: generalize for different offset values here and in feedbacks.js
			switch (midiChannel) {
				case 0: // Ch N: Inputs
					if (note < size_inputs) {
						this.inputMuteState[note] = isMuted
						this.checkFeedbacks('inputMute')
					}
					break

				case 1: // Ch N+1: Groups (Mono 1-48, Stereo 1-24)
					if (note < size_mono_groups) {
						// Mono Groups 1-48
						this.groupMuteState[note] = isMuted
						this.checkFeedbacks('monoGroupMute')
					} else if (note >= size_mono_groups && note < size_mono_groups + size_stereo_groups) {
						//stereo Groups 1-24
						this.groupMuteState[note - offset_stereo_groups] = isMuted // Offset for Stereo Groups
						this.checkFeedbacks('stereoGroupMute')
					}
					break

				case 2: // Ch N+2: Auxes (Mono 1-48, Stereo 1-24)
					if (note < size_mono_aux) {
						// Mono auxes 1-48
						this.auxMuteState[note] = isMuted
						this.checkFeedbacks('monoAuxMute')
					} else if (note >= size_mono_aux && note < size_mono_aux + size_stereo_aux) {
						//stereo auxes 1-24
						this.auxMuteState[note - offset_stereo_aux] = isMuted // Offset for Stereo Groups
						this.checkFeedbacks('stereoAuxMute')
					}
					break

				case 3: // Ch N+3: Matrices (Mono 1-48, Stereo 1-24)
					if (note < size_mono_matrix) {
						// Mono matrices 1-48
						this.matrixMuteState[note] = isMuted
						this.checkFeedbacks('monoMatrixMute')
					} else if (note >= size_mono_matrix && note < size_mono_matrix + size_stereo_matrix) {
						//stereo matrices 1-24
						this.matrixMuteState[note - offset_stereo_matrix] = isMuted // Offset for Stereo Groups
						this.checkFeedbacks('stereoMatrixMute')
					}
					break

				case 4: // Ch N+4: FX, Mains, CG, Mute Groups
					let fx_send_total = size_mono_fx_sends + size_stereo_fx_sends
					let fx_return_total = fx_send_total + size_fx_returns
					let area_outs_total = fx_return_total + size_area_outs
					let cg_total = area_outs_total + size_cg
					let mute_group_total = cg_total + size_mute_groups

					if (note >= 0x00 && note <= size_mono_fx_sends) {
						// Mono FX Send 1-16
						this.fxSendMuteState[note] = isMuted
						this.checkFeedbacks('monoFxSendMute')
					} else if (note >= size_mono_fx_sends && note <= fx_send_total) {
						// Stereo FX Send 1-16
						// Map to index 16-31 in our array
						this.fxSendMuteState[note - offset_stereo_fx_sends] = isMuted
						this.checkFeedbacks('stereoFxSendMute')
					} else if (note >= fx_send_total && note <= fx_return_total) {
						// FX Return 1-16
						this.fxReturnMuteState[note - offset_fx_returns] = isMuted
						this.checkFeedbacks('fxReturnMute')
					} else if (note >= fx_return_total && note <= area_outs_total) {
						// Area Outs 1-4
						this.areaOutsMuteState[note - offset_area_outs] = isMuted
						this.checkFeedbacks('areaOutsMute')
					} else if (note >= area_outs_total && note <= cg_total) {
						// CG 1-24
						this.cgMuteState[note - offset_cg] = isMuted
						this.checkFeedbacks('controlGroupCGMute')
					} else if (note >= cg_total && note <= mute_group_total) {
						// Mute Groups 1-8
						this.muteGroupMuteState[note - offset_mute_groups] = isMuted
						this.checkFeedbacks('muteGroupMute')
					}
					break
			}

			// Skip the next 2 bytes since we processed them
			i += 2
		}
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 2.0.0
	 */
	async configUpdated(config) {
		// Provide default config if none exists
		this.config = config || {
			host: '192.168.1.70',
			model: '4rea4',
			midiPort: 51328,
			tcpPort: 51321,
			midiChannel: 0,
		}

		// Ensure port defaults are set even if config exists
		if (!this.config.midiPort) this.config.midiPort = 51328
		if (!this.config.tcpPort) this.config.tcpPort = 51321
		if (this.config.midiChannel === undefined) this.config.midiChannel = 0

		this.updateActions()
		this.init_tcp()
	}
}

runEntrypoint(ModuleInstance, upgradeScripts)
