const easings = {
  "parabolic": (t,max,duration) => {return max + (max/(duration*duration))*(t-duration)*(t-duration)}
}

const anims = {
  "run": {
    "speed": 6,
    "fenceX": {
      "min": 0,
      "max": 0,
      "curve": "sin"
    },
    "translateY": {
      "min": 0,
      "max": .05,
      "curve": "cos1"
    },
    "joints": {
      "body": {
        "min": -10,
        "max": 10,
        "curve": "sin"
      },
      "neck": {
        "min": 0,
        "max": 10,
        "curve": "sin"
      },
      "head": {
        "min": 0,
        "max": 10,
        "curve": "sin"
      },
      "ear": {
        "min": 0,
        "max": 0,
        "curve": "sin"
      },
      "tail": {
        "min": -10,
        "max": 0,
        "curve": "sin"
      },
      // BACK LEFT LEG
      "legBL_j1": {
        "min": -40 / 2,
        "max": 15,
        "curve": "cos"
      },
      "legBL_j2": {
        "min": -30 / 2,
        "max": 100 / 2,
        "curve": "sin"
      },
      "legBL_j3": {
        "min": -20 / 1,
        "max": 30 / 1,
        "curve": "cos"
      },
      "legBL_j4": {
        "min": 0,
        "max": 0,
        "curve": "sin"
      },
      // BACK RIGHT LEG
      "legBR_j1": {
        "min": -40 / 2,
        "max": 15,
        "curve": "sin"
      },
      "legBR_j2": {
        "min": -30 / 2,
        "max": 100 / 2,
        "curve": "cos"
      },
      "legBR_j3": {
        "min": -20 / 1,
        "max": 30 / 1,
        "curve": "sin"
      },
      "legBR_j4": {
        "min": 0,
        "max": 0,
        "curve": "sin"
      },
      // FRONT LEFT LEG
      "legFL_j1": {
        "min": -10 / 2,
        "max": 0 / 2,
        "curve": "cos"
      },
      "legFL_j2": {
        "min": -50 / 4,
        "max": 80 / 2,
        "curve": "sin"
      },
      "legFL_j3": {
        "min": -10 / 1,
        "max": 30 / 2,
        "curve": "sin"
      },
      "legFL_j4": {
        "min": 0,
        "max": 0,
        "curve": "sin"
      },
      // FRONT RIGHT LEG
      "legFR_j1": {
        "min": -10 / 2,
        "max": 0 / 2,
        "curve": "sin"
      },
      "legFR_j2": {
        "min": -50 / 4,
        "max": 80 / 2,
        "curve": "cos"
      },
      "legFR_j3": {
        "min": -10 / 1,
        "max": 30 / 2,
        "curve": "sin"
      },
      "legFR_j4": {
        "min": 0,
        "max": 0,
        "curve": "sin"
      }
    } 
  },
  "jump": {
    "speed": 4,
    "fenceX": {
      "min": 0,
      "max": 1.4,
      "curve": "sin"
    },
    "translateY": {
      "min": 0,
      "max": .1,
      "curve": "cos1"
    },
    "joints": {
      "body": {
        "min": 0,
        "max": -10,
        "curve": "sin"
      },
      "neck": {
        "min": 0,
        "max": 5,
        "curve": "sin"
      },
      "head": {
        "min": 0,
        "max": -5,
        "curve": "cos1"
      },
      "tail": {
        "min": 0,
        "max": 10,
        "curve": "sin"
      },
      // BACK LEFT LEG
      "legBL_j1": {
        "min": 0,
        "max": -15,
        "curve": "sin"
      },
      "legBL_j2": {
        "min": 0,
        "max": 30,
        "curve": "cos1"
      },
      "legBL_j3": {
        "min": 0,
        "max": 15,
        "curve": "cos1"
      },
      // BACK RIGHT LEG
      "legBR_j1": {
        "min": 0,
        "max": -15,
        "curve": "sin"
      },
      "legBR_j2": {
        "min": 0,
        "max": 30,
        "curve": "cos1"
      },
      "legBR_j3": {
        "min": 0,
        "max": 15,
        "curve": "cos1"
      },
      // FRONT LEFT LEG
      "legFL_j1": {
        "min": 0,
        "max": -10,
        "curve": "sin"
      },
      "legFL_j2": {
        "min": 0,
        "max": 5,
        "curve": "cos1"
      },
      "legFL_j3": {
        "min": 0,
        "max": 30,
        "curve": "cos1"
      },
      // FRONT RIGHT LEG
      "legFR_j1": {
        "min": 0,
        "max": -10,
        "curve": "sin"
      },
      "legFR_j2": {
        "min": 0,
        "max": 5,
        "curve": "cos1"
      },
      "legFR_j3": {
        "min": 0,
        "max": 30,
        "curve": "cos1"
      },
    } 
  }
}

const angles = {
  "body": 0,
  "head": 0,
  "ear": 0,
  "neck": 0,
  "tail": 0,
  "legBL_j1": 0,
  "legBL_j2": 0,
  "legBL_j3": 0,
  "legBL_j4": 0,
  "legBR_j1": 0,
  "legBR_j2": 0,
  "legBR_j3": 0,
  "legBR_j4": 0,
  "legFL_j1": 0,
  "legFL_j2": 0,
  "legFL_j3": 0,
  "legFL_j4": 0,
  "legFR_j1": 0,
  "legFR_j2": 0,
  "legFR_j3": 0,
  "legFR_j4": 0,
}