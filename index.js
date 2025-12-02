/**
 *
 * Companion instance class for the DiGiCo 4rea4 line of consoles.
 * @version 1.0.0a
 *
 */

const { InstanceBase, Regex, runEntrypoint, TCPHelper } = require('@companion-module/base')
const actions = require('./actions')
const upgradeScripts = require('./upgrade')
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
		let start = isMute ? this.dcaCount : 0
		let qty = isMute ? 8 : this.dcaCount
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
			case 'mute_dca':
			case 'mute_master':
			case 'mute_ufx_send':
			case 'mute_ufx_return':
				chOfs = 4
				break

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

			case 'fader_DCA':
			case 'fader_mono_fx_send':
			case 'fader_stereo_fx_send':
			case 'fader_fx_return':
			case 'fader_ufx_send':
			case 'fader_ufx_return':
				chOfs = 4
				break

			case 'phantom':
				cmd.buffers = [
					Buffer.from([0xf0, 0, 0, 0x1a, 0x50, 0x10, 0x01, 0, 0, 0x0c, strip, opt.phantom ? 0x7f : 0, 0xf7]),
				]
				break

			case 'dca_assign':
				cmd.buffers = this.setRouting(channel, opt.dcaGroup, false)
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
				cmd.buffers = [
					Buffer.from([0xf0, 0, 0, 0x1a, 0x50, 0x10, 0x01, 0, 0, 0x0d, strip, opt.pad ? 0x7f : 0, 0xf7]),
				]
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
			case 'send_ufx':
				// SysEx messages for send levels
				let inputCh = parseInt(opt.inputChannel)
				let sendCh = parseInt(opt.send)
				let sendLevel = parseInt(opt.level)
				let sendType = 0x01 // Default for aux sends
				
				if (actionId.includes('fx') && !actionId.includes('ufx')) {
					sendType = 0x02 // FX sends
				} else if (actionId.includes('matrix')) {
					sendType = 0x03 // Matrix sends
				} else if (actionId.includes('ufx')) {
					sendType = 0x04 // UFX sends
				}
				
				cmd.buffers = [
					Buffer.from([0xf0, 0, 0, 0x1a, 0x50, 0x10, 0x01, 0, 0, sendType, inputCh, sendCh, sendLevel, 0xf7]),
				]
				break

			case 'ufx_global_key':
				// Control Change message for UFX Global Key (BN, 0C, Key)
				cmd.buffers = [Buffer.from([0xb0 + (this.config.midiChannel || 0), 0x0c, parseInt(opt.key)])]
				break

			case 'ufx_global_scale':
				// Control Change message for UFX Global Scale (BN, 0D, Scale)
				cmd.buffers = [Buffer.from([0xb0 + (this.config.midiChannel || 0), 0x0d, parseInt(opt.scale)])]
				break

			case 'ufx_unit_parameter':
				// Control Change message for UFX Unit Parameter (BM, nn, vv)
				let midiCh = parseInt(opt.midiChannel) - 1 // Convert to 0-based
				cmd.buffers = [Buffer.from([0xb0 + midiCh, parseInt(opt.controlNumber), parseInt(opt.value)])]
				break

			case 'ufx_unit_key':
				// Control Change message for UFX Unit Key Parameter with CC value scaling
				let keyMidiCh = parseInt(opt.midiChannel) - 1 // Convert to 0-based
				let controlNum = parseInt(opt.controlNumber)
				
				// Map key to CC value range (refer to protocol table)
				let keyMapping = {
					'C': 5,    // Mid-range value for C (0-10 range)
					'C#': 16,  // Mid-range value for C# (11-21 range)
					'D': 26,   // Mid-range value for D (22-31 range)
					'D#': 37,  // Mid-range value for D# (32-42 range)
					'E': 47,   // Mid-range value for E (43-52 range)
					'F': 58,   // Mid-range value for F (53-63 range)
					'F#': 69,  // Mid-range value for F# (64-74 range)
					'G': 79,   // Mid-range value for G (75-84 range)
					'G#': 90,  // Mid-range value for G# (85-95 range)
					'A': 100,  // Mid-range value for A (96-105 range)
					'A#': 111, // Mid-range value for A# (106-116 range)
					'B': 122   // Mid-range value for B (117-127 range)
				}
				
				let keyValue = keyMapping[opt.key] || 5
				cmd.buffers = [Buffer.from([0xb0 + keyMidiCh, controlNum, keyValue])]
				break

			case 'ufx_unit_scale':
				// Control Change message for UFX Unit Scale Parameter with CC value scaling
				let scaleMidiCh = parseInt(opt.midiChannel) - 1 // Convert to 0-based
				let scaleControlNum = parseInt(opt.controlNumber)
				
				// Map scale to CC value range (refer to protocol table)
				let scaleMapping = {
					'Major': 21,      // Mid-range value for Major (0-42 range)
					'Minor': 63,      // Mid-range value for Minor (43-84 range)
					'Chromatic': 106  // Mid-range value for Chromatic (85-127 range)
				}
				
				let scaleValue = scaleMapping[opt.scale] || 21
				cmd.buffers = [Buffer.from([0xb0 + scaleMidiCh, scaleControlNum, scaleValue])]
				break

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
				this.log('debug', `sending ${cmd.buffers[i].toString('hex')} via MIDI @${this.config.host}:${this.config.midiPort}`)
				this.midiSocket.send(cmd.buffers[i]).catch((e) => {
					this.log('error', `MIDI send error: ${e.message}`)
				})
			} else if (this.tcpSocket !== undefined) {
				this.log('debug', `sending ${cmd.buffers[i].toString('hex')} via TCP @${this.config.host}:${this.config.tcpPort}`)
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
				choices: [
					{ id: '4rea4', label: '4rea4' }
				],
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
				label: 'TCP Port (4rea4 only)',
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
		this.inputMuteState = new Array(128).fill(0) 
		this.groupMuteState = new Array(64).fill(0) 	// Covers Mono and Stereo Groups
		this.auxMuteState = new Array(64).fill(0)   	// Covers Mono and Stereo Auxes
		this.matrixMuteState = new Array(64).fill(0)	// Covers Mono and Stereo Matrix
		this.fxSendMuteState = new Array(32).fill(0)	// Covers Mono and Stereo FX Sends
		this.fxReturnMuteState = new Array(16).fill(0)
		this.dcaMuteState = new Array(24).fill(0)
		this.muteGroupMuteState = new Array(8).fill(0)
		this.masterMuteState = new Array(8).fill(0) 	// For Mains/Masters
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
        let byte = data[i];

        // Check for Note On messages (0x90 - 0x9F)
        // Assuming MIDI Channel N = 0 (Default). Adjust logic if N > 0.
        if (byte >= 0x90 && byte <= 0x94) {
            let midiChannel = byte & 0x0F;
            let note = data[i+1];
            let velocity = data[i+2];
            
            // 4rea4 Spec: Velocity > 0x40 is Mute ON, < 0x40 is Mute OFF
            let isMuted = velocity >= 0x40 ? 1 : 0; 

            // Handle based on MIDI Channel (N=0)
            switch (true) {
                case (midiChannel == 0): // Ch N: Inputs
                    if (note < 128) {
                        this.inputMuteState[note] = isMuted;
                        this.checkFeedbacks('inputMute');
                    }
                    break;

                case ((midiChannel == 1) && (note >= 0x00 && note <= 0x3D)): // Ch N+1: Groups Mono (1-48)
                    this.groupMuteState[note] = isMuted;
                    this.checkFeedbacks('groupMute');
                    break;

				case ((midiChannel == 1) && (note >= 0x40 && note <= 0x57)): // Ch N+1: Groups Stereo (1-24)
					this.groupMuteState[note] = isMuted;
					this.checkFeedbacks('groupMute');
					break;

                case ((midiChannel == 2) && (note >= 0x00 && note <= 0x2f)): // Ch N+2: Auxes Mono (1-48)
                    this.auxMuteState[note] = isMuted;
                    this.checkFeedbacks('auxMute');
                    break;

                case 3: // Ch N+3: Matrix (Mono 0-61, Stereo 64-95)
                    this.matrixMuteState[note] = isMuted;
                    this.checkFeedbacks('matrixMute');
                    break;

                case 4: // Ch N+4: FX, Mains, DCA, Mute Groups
                    // Map based on Note ranges from Protocol PDF
                    if (note >= 0x00 && note <= 0x0F) { // Mono FX Send 1-16
                        this.fxSendMuteState[note] = isMuted; 
                        this.checkFeedbacks('fxSendMute');
                    } 
                    else if (note >= 0x10 && note <= 0x1F) { // Stereo FX Send 1-16
                        // Map to index 16-31 in our array
                        this.fxSendMuteState[note] = isMuted; 
                        this.checkFeedbacks('fxSendMute');
                    }
                    else if (note >= 0x20 && note <= 0x2F) { // FX Return 1-16
                        this.fxReturnMuteState[note - 0x20] = isMuted;
                        this.checkFeedbacks('fxReturnMute');
                    }
                    else if (note >= 0x30 && note <= 0x35) { // Mains 1-6
                        this.masterMuteState[note - 0x30] = isMuted;
                        this.checkFeedbacks('masterMute');
                    }
                    else if (note >= 0x36 && note <= 0x4D) { // DCA 1-24
                        this.dcaMuteState[note - 0x36] = isMuted;
                        this.checkFeedbacks('dcaMute');
                    }
                    else if (note >= 0x4E && note <= 0x55) { // Mute Groups 1-8
                        this.muteGroupMuteState[note - 0x4E] = isMuted;
                        this.checkFeedbacks('muteGroupMute');
                    }
                    break;
            }
            
            // Skip the next 2 bytes since we processed them
            i += 2; 
        }
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
			midiChannel: 0
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
