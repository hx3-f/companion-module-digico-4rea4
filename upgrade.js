const upgradeScripts = [
	//Upgrade 2.0.0(dLive, iLive) > 1.0.0a(4rea4)
	function (context, props) {
		const result = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		if (props.config) {
			if (props.config.port === undefined) {
				result.updatedConfig = { ...props.config, model: '4rea4' }
			}
		}

		return result
	},

	// Upgrade 1.2.0 > 1.3.0 (adding iLive functions)
	function (context, props) {
		const result = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		if (props.config) {
			if (props.config.model === undefined) {
				result.updatedConfig = { ...props.config, model: 'dlive' }
			}
		}

		return result
	},

	// Upgrade 1.0.x > 1.2.0
	function (context, props) {
		const result = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		let cgChArr = []

		console.log('Running 1.0.x -> 1.2.0 Upgrade.')

		for (let action of props.actions) {
			let newAction = { ...action }
			let changed = false

			switch (action.actionId) {
				case 'mute_input':
					newAction.options.mute = action.options.mute == 'mute_on' ? true : false
					changed = true
					break
				case 'cg_assignment_on':
					if (cgChArr[action.options.inputChannel] == undefined) {
						cgChArr[action.options.inputChannel] = []
					}
					newAction.actionId = 'cg_assign'
					cgChArr[action.options.inputChannel].push(`${action.options.cgChannel & 0x3f}`)
					changed = true
					break
				case 'scene_recall_128':
				case 'scene_recall_256':
				case 'scene_recall_384':
				case 'scene_recall_500':
					newAction.actionId = 'scene_recall'
					changed = true
					break
			}

			if (changed) {
				console.log(`Action ${action.actionId} => ${newAction.actionId}`)
				result.updatedActions.push(newAction)
			}
		}

		// Update CG assignments
		for (let action of result.updatedActions) {
			if (action.actionId == 'cg_assign') {
				action.options['cgGroup'] = cgChArr[action.options.inputChannel]
			}
		}

		return result
	},
]

module.exports = upgradeScripts
