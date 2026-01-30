const anims = {
  "walk": {
    "joints": {
      "body": {
        "min": -5,
        "max": 5,
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
        "max": 30,
        "curve": "cos"
      },
      "legBL_j2": {
        "min": -10 / 2,
        "max": 100 / 2,
        "curve": "sin"
      },
      "legBL_j3": {
        "min": -20 / 2,
        "max": 20 / 1,
        "curve": "cos"
      },
      // BACK RIGHT LEG
      "legBR_j1": {
        "min": -40 / 2,
        "max": 30,
        "curve": "sin"
      },
      "legBR_j2": {
        "min": -10 / 2,
        "max": 100 / 2,
        "curve": "cos"
      },
      "legBR_j3": {
        "min": -20 / 2,
        "max": 20 / 1,
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
        "min": -10 / 2,
        "max": 30 / 2,
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
        "min": -10 / 2,
        "max": 30 / 2,
        "curve": "sin"
      }
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
  "legBR_j1": 0,
  "legBR_j2": 0,
  "legBR_j3": 0,
  "legFL_j1": 0,
  "legFL_j2": 0,
  "legFL_j3": 0,
  "legFR_j1": 0,
  "legFR_j2": 0,
  "legFR_j3": 0,
}