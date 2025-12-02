# Allen & Heath 4rea4 & iLive Module

This module provides comprehensive control for DiGiCo 4rea4 digital mixing consoles via MIDI over TCP/IP.

## Origins

This module is almost entirely based on the work of (Andrew Broughton)[https://github.com/MeestorX] and (Jeffery Davidsz)[https://github.com/JeffreyDavidsz], on their Allen Heath iDlive/iLive module. Lots of troubleshooting and information for this plugin can be discovered at their plugin's repo, (companion-module-allenheath-dlive-ilive)[https://github.com/bitfocus/companion-module-allenheath-dlive-ilive].
The feedback portion of this module is heavily based on (Jeffery Davidsz's)[https://github.com/JeffreyDavidsz] AHM module.

## Supported Consoles

- **4rea4 Series**: Compatible feature set with up to 128 input channels, 24 Control Groups, and 800 scenes.

## Connection Setup

1. **IP Address**: Enter the IP address of your 4rea4 Surface or MixRack
2. **Network Ports**:
   - **MIDI Port**: Configurable (default: 51328) - Used for basic mixer commands
   - **TCP Port**: Configurable (default: 51321) - Used for 4rea4 advanced features only
3. **MIDI Channel Configuration**:
   - **MIDI Channel for 4rea4 System (N)**: Base MIDI channel for 4rea4 system control (default: 0)
   - **Note**: 4rea4 uses 5 consecutive MIDI channels (N through N+4) for different control types
4. **Port Configuration**: Both MIDI and TCP ports can be customized in the module configuration

## Available Actions

- **Mute Input Channel** - Mute/unmute input channels 1-128
- **Mute Mono Groups** - Mute/unmute mono groups 1-48
- **Mute Stereo Groups** - Mute/unmute stereo groups 1-24
- **Mute Mono Auxes** - Mute/unmute mono auxes 1-48
- **Mute Stereo Auxes** - Mute/unmute stereo auxes 1-24
- **Mute Mono Matrices** - Mute/unmute mono matrices 1-48
- **Mute Stereo Matrices** - Mute/unmute stereo matrices 1-24
- **Mute Mono FX Sends** - Mute/unmute mono FX sends 1-16
- **Mute Stereo FX Sends** - Mute/unmute stereo FX sends 1-16
- **Mute FX Returns** - Mute/unmute FX Returns 1-16
- **Mute Area Outs** - Mute/unmute area outs 1-4
- **Mute Control Groups*(CG)*** - Mute/unmute Control Groups 1-24
- **Mute Groups** - Mute/unmute mute groups 1-8

### Fader Level Controls

- **Set Input Fader to Level** - Control input channel fader levels
- **Set FX Send Master Fader to Level** - Control FX send master levels
- **Set FX Return Fader to Level** - Control FX return levels
- **Set Control Group(CG) Fader to Level** - Control CG fader levels
- **Set Mono Group Master Fader to Level** - Control mono group master levels
- **Set Stereo Group Master Fader to Level** - Control stereo group master levels
- **Set Mono Aux Master Fader to Level** - Control mono aux master levels
- **Set Stereo Aux Master Fader to Level** - Control stereo aux master levels
- **Set Mono Matrix Master Fader to Level** - Control mono matrix master levels
- **Set Stereo Matrix Master Fader to Level** - Control stereo matrix master levels
- **Set UFX Stereo Send Fader to Level** - Control UFX stereo send levels
- **Set UFX Stereo Return Fader to Level** - Control UFX stereo return levels

### 🎛️ Advanced Controls (Protocol V2.0)

#### Scene Management:

- **Scene Recall** - Recall a specific cue by number
- **Scene Go Next** - Navigate to the next cue
- **Scene Go Previous** - Navigate to the previous cue

#### Solo Controls:

- **Solo Input Channel** - Solo/unsolo input channels

#### EQ Controls:

- **EQ Enable/Disable Input Channel** - Enable or disable EQ on input channels

#### Preamp Controls:

- **Set Preamp Gain** - Control preamp gain levels (-10dB to +50dB range)
- **Toggle Preamp Pad** - Enable/disable -20dB input pad

#### Filter Controls:

- **Set High Pass Filter** - Control HPF frequency (Off, 20Hz to 400Hz)

#### Send Level Controls:

- **Set Aux Mono Send Level** - Control individual aux mono send levels
- **Set Aux Stereo Send Level** - Control individual aux stereo send levels
- **Set FX Mono Send Level** - Control individual FX mono send levels
- **Set FX Stereo Send Level** - Control individual FX stereo send levels
- **Set Matrix Mono Send Level** - Control individual matrix mono send levels
- **Set Matrix Stereo Send Level** - Control individual matrix stereo send levels
- **Input to Main Assign** - Assign/unassign inputs to main mix
- **Set UFX Stereo Send Level** - Control individual UFX stereo send levels

### Routing & Assignment

- **Assign CG for Channel** - Assign input channels to multiple CG groups
- **Assign Mute Groups for Channel** _(4rea4 only)_ - Assign input channels to multiple mute groups

### Special Features

- **Talkback On** - Enable/disable talkback
- **Virtual Soundcheck** - Switch between Inactive, Record Send, and Virtual Soundcheck modes

## Fader Level Range

All fader controls use a precise dB scale:

- **Range**: -∞ to +10.5dB
- **Resolution**: 0.5dB steps
- **Total Steps**: 128 levels

## Technical Notes

- **MIDI Implementation**: Uses standard MIDI commands (Note On, Control Change, NRPN, SysEx, Pitchbend)
- **UFX Card Support**: Full support for UFX effects processing cards including parameter control and routing
- **MIDI Channel Management**: Supports both 4rea4 system channels (N through N+4) and individual UFX unit channels (M)
- **Real-time Control**: All actions are executed immediately
- **Error Handling**: Connection status and error logging included
- **Debug Logging**: Detailed MIDI message logging available

## Version History

- **v2.0.3**: Added UFX card support for 4rea4 systems
  - UFX stereo send/return mute and level controls
  - UFX global key and scale controls
  - UFX unit parameter controls with CC value scaling
  - MIDI channel configuration for 4rea4 system
- **v2.0.0**: Complete rewrite for Companion 3.0/4.0 compatibility
  - Added Protocol V2.0 support with 20+ new actions
  - Enhanced EQ, preamp, and send level controls
  - Improved scene navigation
  - Solo controls and advanced routing
- **v1.x**: Legacy Companion 2.x versions

## Compatibility

- **Companion**: Version 3.0+ (use v1.x for Companion 2.x)
- **4rea4 Firmware**: V2.0+ recommended for full Protocol V2.0 features
- **iLive Firmware**: Compatible with current firmware versions

## Support

For technical support and feature requests, please visit the [GitHub repository](https://github.com/bitfocus/companion-module-allenheath-4rea4-ilive).
