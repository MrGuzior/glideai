// ============================================================================
// CONFIGURATION & DATA
// ============================================================================

const CLOUD_LIFECYCLE_CONFIG = {
  minSize: 0.0,
  maxSize: 1.0,
  minStrength: 1.1,
  maxStrength: 1.3,
  baseWidthMin: 100,
  baseWidthMax: 220,
  baseHeightMin: 35,
  baseHeightMax: 75,
  yVariationRange: 120,
  stages: [
    {
      name: "invisible",
      sizeMultiplier: 0.0,
      strengthMultiplier: 1.0,
      baseDuration: 30,
      color: "transparent",
    },
    {
      name: "small",
      sizeMultiplier: 0.6,
      strengthMultiplier: 0.93,
      baseDuration: 60,
      color: "#ecf0f1",
    },
    {
      name: "big",
      sizeMultiplier: 1.0,
      strengthMultiplier: 0.86,
      baseDuration: 150,
      color: "#ecf0f1",
    },
    {
      name: "dying",
      sizeMultiplier: 0.7,
      strengthMultiplier: 0.59,
      baseDuration: 100,
      color: "#bdc3c7",
    },
  ],
};

const GLIDER_CONFIGURATIONS = [
  {
    name: "Training",
    glideRatio: "20:1",
    sinkRate: 1.8,
    speedMultiplier: 1.0,
  },
  {
    name: "Standard",
    glideRatio: "30:1",
    sinkRate: 1.5,
    speedMultiplier: 1.3,
  },
  {
    name: "Competition",
    glideRatio: "50:1",
    sinkRate: 1,
    speedMultiplier: 1.8,
  },
  {
    name: "Jantar Std 2",
    glideRatio: "38:1",
    sinkRate: 1,
    speedMultiplier: 2.5,
  },
  {
    name: "JS6",
    glideRatio: "100:1",
    sinkRate: 1,
    speedMultiplier: 4.5,
  },
];

const GAME_CONFIG = {
  targetFPS: 60,
  velocityTransitionSpeed: 0.1,
  directionTransitionSpeed: 0.1,
  baseCloudSpeed: 2,
  baseMountainSpeed: 0.5,
  baseFarTreeSpeed: 0.75,
  baseNearTreeSpeed: 1.25,
  minCloudSpacing: 300,
  maxCloudSpacing: 500,
  pixelsPerMeter: 5,
};

// ============================================================================
// TIME UTILITIES
// ============================================================================

function calculateDeltaTimeMultiplier(deltaTime, targetFPS) {
  const targetFrameTime = 1000 / targetFPS;
  return deltaTime / targetFrameTime;
}

function createTimeState(currentTime) {
  return {
    lastTime: currentTime,
    deltaTime: 0,
  };
}

function updateTimeState(timeState, currentTime) {
  const deltaTime = currentTime - timeState.lastTime;
  return {
    lastTime: currentTime,
    deltaTime: deltaTime,
  };
}

// ============================================================================
// CANVAS UTILITIES
// ============================================================================

function initializeCanvas(canvasElement) {
  const context = canvasElement.getContext("2d");

  function resizeCanvas() {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  return context;
}

function clearCanvas(context, width, height) {
  context.clearRect(0, 0, width, height);
}

function drawRectangle(context, x, y, width, height, color) {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

function createGround(canvasHeight) {
  const groundHeight = 50;
  return {
    y: canvasHeight - groundHeight,
    height: groundHeight,
    color: "#2ecc71",
  };
}

function renderGround(context, ground, canvasWidth) {
  drawRectangle(context, 0, ground.y, canvasWidth, ground.height, ground.color);
}

function createMountains(canvasWidth, canvasHeight) {
  const mountainBaseY = canvasHeight * 0.6;
  return [
    {
      x: 0,
      baseY: mountainBaseY,
      width: canvasWidth * 0.3,
      height: 150,
      color: "#7f8c8d",
    },
    {
      x: canvasWidth * 0.25,
      baseY: mountainBaseY,
      width: canvasWidth * 0.35,
      height: 200,
      color: "#95a5a6",
    },
    {
      x: canvasWidth * 0.5,
      baseY: mountainBaseY,
      width: canvasWidth * 0.4,
      height: 180,
      color: "#7f8c8d",
    },
    {
      x: canvasWidth * 0.8,
      baseY: mountainBaseY,
      width: canvasWidth * 0.3,
      height: 160,
      color: "#95a5a6",
    },
  ];
}

function updateMountainPosition(mountain, speed, direction, canvasWidth, deltaTimeMultiplier) {
  const newX = mountain.x - speed * direction * deltaTimeMultiplier;
  let wrappedX = newX;

  if (direction > 0) {
    if (newX < -mountain.width) {
      wrappedX = canvasWidth;
    }
  } else {
    if (newX > canvasWidth) {
      wrappedX = -mountain.width;
    }
  }

  return { ...mountain, x: wrappedX };
}

function updateMountains(mountains, speed, direction, canvasWidth, deltaTimeMultiplier) {
  return mountains.map((mountain) =>
    updateMountainPosition(mountain, speed, direction, canvasWidth, deltaTimeMultiplier),
  );
}

function renderMountain(context, mountain) {
  context.fillStyle = mountain.color;
  context.beginPath();
  context.moveTo(mountain.x, mountain.baseY);
  context.lineTo(
    mountain.x + mountain.width / 2,
    mountain.baseY - mountain.height,
  );
  context.lineTo(mountain.x + mountain.width, mountain.baseY);
  context.closePath();
  context.fill();
}

function renderMountains(context, mountains) {
  mountains.forEach((mountain) => renderMountain(context, mountain));
}

function createFarTrees(canvasWidth, canvasHeight) {
  const treeBaseY = canvasHeight * 0.75;
  return [
    {
      x: canvasWidth * 0.05,
      baseY: treeBaseY,
      width: 25,
      height: 50,
      color: "#1e8449",
    },
    {
      x: canvasWidth * 0.18,
      baseY: treeBaseY,
      width: 30,
      height: 55,
      color: "#239b56",
    },
    {
      x: canvasWidth * 0.32,
      baseY: treeBaseY,
      width: 22,
      height: 45,
      color: "#1e8449",
    },
    {
      x: canvasWidth * 0.48,
      baseY: treeBaseY,
      width: 28,
      height: 52,
      color: "#239b56",
    },
    {
      x: canvasWidth * 0.62,
      baseY: treeBaseY,
      width: 25,
      height: 48,
      color: "#1e8449",
    },
    {
      x: canvasWidth * 0.78,
      baseY: treeBaseY,
      width: 30,
      height: 55,
      color: "#239b56",
    },
    {
      x: canvasWidth * 0.92,
      baseY: treeBaseY,
      width: 24,
      height: 50,
      color: "#1e8449",
    },
  ];
}

function createNearTrees(canvasWidth, canvasHeight) {
  const treeBaseY = canvasHeight * 0.92;
  return [
    {
      x: canvasWidth * 0.1,
      baseY: treeBaseY,
      width: 55,
      height: 110,
      color: "#27ae60",
    },
    {
      x: canvasWidth * 0.3,
      baseY: treeBaseY,
      width: 65,
      height: 130,
      color: "#2ecc71",
    },
    {
      x: canvasWidth * 0.5,
      baseY: treeBaseY,
      width: 50,
      height: 100,
      color: "#27ae60",
    },
    {
      x: canvasWidth * 0.7,
      baseY: treeBaseY,
      width: 60,
      height: 120,
      color: "#2ecc71",
    },
    {
      x: canvasWidth * 0.9,
      baseY: treeBaseY,
      width: 55,
      height: 115,
      color: "#27ae60",
    },
  ];
}

function updateTreePosition(tree, speed, direction, canvasWidth, deltaTimeMultiplier) {
  const newX = tree.x - speed * direction * deltaTimeMultiplier;
  let wrappedX = newX;

  if (direction > 0) {
    if (newX < -tree.width) {
      wrappedX = canvasWidth;
    }
  } else {
    if (newX > canvasWidth) {
      wrappedX = -tree.width;
    }
  }

  return { ...tree, x: wrappedX };
}

function updateTrees(trees, speed, direction, canvasWidth, deltaTimeMultiplier) {
  return trees.map((tree) =>
    updateTreePosition(tree, speed, direction, canvasWidth, deltaTimeMultiplier),
  );
}

function renderTree(context, tree) {
  context.fillStyle = tree.color;
  context.beginPath();
  context.moveTo(tree.x, tree.baseY);
  context.lineTo(tree.x + tree.width / 2, tree.baseY - tree.height);
  context.lineTo(tree.x + tree.width, tree.baseY);
  context.closePath();
  context.fill();
}

function renderTrees(context, trees) {
  trees.forEach((tree) => renderTree(context, tree));
}

function createClouds(canvasWidth, canvasHeight, lifecycleConfig) {
  const cloudY = canvasHeight * 0.1;
  return [
    {
      x: canvasWidth * 0.2,
      y: cloudY + (Math.random() - 0.5) * 80,
      baseWidth: 140 + Math.random() * 60,
      baseHeight: 45 + Math.random() * 25,
      width: 140 + Math.random() * 60,
      height: 45 + Math.random() * 25,
      color: "#ecf0f1",
      liftStrength: 1.6 + Math.random() * 0.8,
      stage: "big",
      age: 200,
      dyingAge: 0,
      updateInterval: 1 + Math.floor(Math.random() * 3),
      durations: generateRandomDurations(lifecycleConfig),
    },
    {
      x: canvasWidth * 0.5,
      y: cloudY + (Math.random() - 0.5) * 80,
      baseWidth: 120 + Math.random() * 80,
      baseHeight: 40 + Math.random() * 30,
      width: 120 + Math.random() * 80,
      height: 40 + Math.random() * 30,
      color: "#ecf0f1",
      liftStrength: 1.6 + Math.random() * 0.8,
      stage: "big",
      age: 200,
      dyingAge: 0,
      updateInterval: 1 + Math.floor(Math.random() * 3),
      durations: generateRandomDurations(lifecycleConfig),
    },
    {
      x: canvasWidth * 0.8,
      y: cloudY + (Math.random() - 0.5) * 80,
      baseWidth: 160 + Math.random() * 80,
      baseHeight: 50 + Math.random() * 35,
      width: 160 + Math.random() * 80,
      height: 50 + Math.random() * 35,
      color: "#ecf0f1",
      liftStrength: 1.6 + Math.random() * 0.8,
      stage: "big",
      age: 200,
      dyingAge: 0,
      updateInterval: 1 + Math.floor(Math.random() * 3),
      durations: generateRandomDurations(lifecycleConfig),
    },
  ];
}

function getCloudLifecycleStageNames(lifecycleConfig) {
  return lifecycleConfig.stages.map((stage) => stage.name);
}

function getRandomCloudStage(lifecycleConfig) {
  const stageNames = getCloudLifecycleStageNames(lifecycleConfig);
  const randomIndex = Math.floor(Math.random() * stageNames.length);
  return stageNames[randomIndex];
}

function generateRandomDurations(lifecycleConfig) {
  const randomMultiplier = 0.5 + Math.random() * 1.0;
  const durations = {};
  lifecycleConfig.stages.forEach((stage) => {
    durations[stage.name + "Duration"] = Math.floor(
      stage.baseDuration * randomMultiplier,
    );
  });
  return durations;
}

function getStageClimbRate(stageName, lifecycleConfig) {
  const stage = lifecycleConfig.stages.find((s) => s.name === stageName);
  if (!stage) return lifecycleConfig.minStrength;
  const strengthRange =
    lifecycleConfig.maxStrength - lifecycleConfig.minStrength;
  return lifecycleConfig.minStrength + strengthRange * stage.strengthMultiplier;
}

function calculateAgeForStage(
  stageName,
  durations,
  updateInterval,
  lifecycleConfig,
) {
  let cumulativeAge = 0;
  for (const stage of lifecycleConfig.stages) {
    if (stage.name === stageName) {
      return cumulativeAge * updateInterval;
    }
    const durationKey = stage.name + "Duration";
    cumulativeAge += durations[durationKey] || 0;
  }
  return cumulativeAge * updateInterval;
}

function createRandomCloud(
  canvasWidth,
  canvasHeight,
  direction,
  lifecycleConfig,
) {
  const cloudY = canvasHeight * 0.1;
  const yVariation = (Math.random() - 0.5) * lifecycleConfig.yVariationRange;
  const widthRange =
    lifecycleConfig.baseWidthMax - lifecycleConfig.baseWidthMin;
  const heightRange =
    lifecycleConfig.baseHeightMax - lifecycleConfig.baseHeightMin;
  const baseWidth = lifecycleConfig.baseWidthMin + Math.random() * widthRange;
  const baseHeight =
    lifecycleConfig.baseHeightMin + Math.random() * heightRange;
  const spawnX = direction > 0 ? canvasWidth + baseWidth / 2 : -baseWidth / 2;
  const liftStrength = 1.6 + Math.random() * 0.8;
  const updateInterval = 1 + Math.floor(Math.random() * 3);
  const stage = getRandomCloudStage(lifecycleConfig);
  const durations = generateRandomDurations(lifecycleConfig);
  const age = calculateAgeForStage(
    stage,
    durations,
    updateInterval,
    lifecycleConfig,
  );
  const stageProperties = getCloudStageProperties(
    stage,
    baseWidth,
    baseHeight,
    lifecycleConfig,
  );

  return {
    x: spawnX,
    y: cloudY + yVariation,
    baseWidth: baseWidth,
    baseHeight: baseHeight,
    width: stageProperties.width,
    height: stageProperties.height,
    color: stageProperties.color,
    liftStrength: liftStrength,
    stage: stage,
    age: age,
    dyingAge: stage === "dying" ? 1 : 0,
    updateInterval: updateInterval,
    durations: durations,
  };
}

function getCloudStageProperties(
  stageName,
  baseWidth,
  baseHeight,
  lifecycleConfig,
) {
  const stage = lifecycleConfig.stages.find((s) => s.name === stageName);
  if (!stage) {
    return { width: 0, height: 0, color: "transparent" };
  }
  return {
    width: baseWidth * stage.sizeMultiplier,
    height: baseHeight * stage.sizeMultiplier,
    color: stage.color,
  };
}

function findNextStage(cloud, effectiveAge, lifecycleConfig) {
  let cumulativeAge = 0;

  for (let i = 0; i < lifecycleConfig.stages.length; i++) {
    const stage = lifecycleConfig.stages[i];
    const durationKey = stage.name + "Duration";
    const stageDuration = cloud.durations[durationKey] || 0;

    if (cloud.stage === stage.name) {
      if (effectiveAge >= cumulativeAge + stageDuration) {
        const nextStage = lifecycleConfig.stages[i + 1];
        return nextStage ? nextStage.name : cloud.stage;
      }
      return cloud.stage;
    }
    cumulativeAge += stageDuration;
  }

  return cloud.stage;
}

function advanceCloudStage(cloud, lifecycleConfig, deltaTimeMultiplier) {
  const newAge = cloud.age + deltaTimeMultiplier;
  const shouldUpdate = Math.floor(newAge / cloud.updateInterval) > Math.floor(cloud.age / cloud.updateInterval);

  if (!shouldUpdate) {
    return { ...cloud, age: newAge };
  }

  const effectiveAge = Math.floor(newAge / cloud.updateInterval);
  const newStage = findNextStage(cloud, effectiveAge, lifecycleConfig);
  const lastStage = lifecycleConfig.stages[lifecycleConfig.stages.length - 1];
  const isLastStage = newStage === lastStage.name;
  const dyingAge = isLastStage ? (cloud.dyingAge || 0) + deltaTimeMultiplier : 0;
  const stageProperties = getCloudStageProperties(
    newStage,
    cloud.baseWidth,
    cloud.baseHeight,
    lifecycleConfig,
  );

  return {
    ...cloud,
    age: newAge,
    stage: newStage,
    dyingAge: dyingAge,
    width: stageProperties.width,
    height: stageProperties.height,
    color: stageProperties.color,
  };
}

function removeExpiredClouds(clouds, lifecycleConfig) {
  const lastStage = lifecycleConfig.stages[lifecycleConfig.stages.length - 1];
  const lastStageDurationKey = lastStage.name + "Duration";

  return clouds.filter((cloud) => {
    if (cloud.stage !== lastStage.name) return true;
    return (cloud.dyingAge || 0) < cloud.durations[lastStageDurationKey];
  });
}

function removeOffscreenClouds(clouds, canvasWidth, direction) {
  return clouds.filter((cloud) => {
    if (direction > 0) {
      return cloud.x > -cloud.width / 2;
    } else {
      return cloud.x < canvasWidth + cloud.width / 2;
    }
  });
}

function getDistanceToEdge(clouds, canvasWidth, direction) {
  if (clouds.length === 0) return Infinity;

  if (direction > 0) {
    const rightmostCloud = clouds.reduce(
      (max, cloud) => (cloud.x > max.x ? cloud : max),
      clouds[0],
    );
    return canvasWidth - rightmostCloud.x;
  } else {
    const leftmostCloud = clouds.reduce(
      (min, cloud) => (cloud.x < min.x ? cloud : min),
      clouds[0],
    );
    return leftmostCloud.x;
  }
}

function shouldSpawnCloud(
  clouds,
  canvasWidth,
  minSpacing,
  maxSpacing,
  direction,
) {
  const distance = getDistanceToEdge(clouds, canvasWidth, direction);

  if (distance >= maxSpacing) return true;
  if (distance < minSpacing) return false;

  const spawnChance = (distance - minSpacing) / (maxSpacing - minSpacing);
  return Math.random() < spawnChance * 0.1;
}

function spawnCloudIfNeeded(
  clouds,
  canvasWidth,
  canvasHeight,
  minSpacing,
  maxSpacing,
  direction,
  lifecycleConfig,
) {
  if (
    shouldSpawnCloud(clouds, canvasWidth, minSpacing, maxSpacing, direction)
  ) {
    return [
      ...clouds,
      createRandomCloud(canvasWidth, canvasHeight, direction, lifecycleConfig),
    ];
  }
  return clouds;
}

function updateCloudPosition(cloud, speed, direction, deltaTimeMultiplier) {
  return { ...cloud, x: cloud.x - speed * direction * deltaTimeMultiplier };
}

function updateClouds(
  clouds,
  speed,
  canvasWidth,
  canvasHeight,
  minSpacing,
  maxSpacing,
  direction,
  lifecycleConfig,
  deltaTimeMultiplier,
) {
  const agedClouds = clouds.map((cloud) =>
    advanceCloudStage(cloud, lifecycleConfig, deltaTimeMultiplier),
  );
  const movedClouds = agedClouds.map((cloud) =>
    updateCloudPosition(cloud, speed, direction, deltaTimeMultiplier),
  );
  const withoutExpired = removeExpiredClouds(movedClouds, lifecycleConfig);
  const cleanedClouds = removeOffscreenClouds(
    withoutExpired,
    canvasWidth,
    direction,
  );
  return spawnCloudIfNeeded(
    cleanedClouds,
    canvasWidth,
    canvasHeight,
    minSpacing,
    maxSpacing,
    direction,
    lifecycleConfig,
  );
}

function renderCloud(context, cloud) {
  if (cloud.stage === "invisible") return;
  drawRectangle(
    context,
    cloud.x - cloud.width / 2,
    cloud.y - cloud.height / 2,
    cloud.width,
    cloud.height,
    cloud.color,
  );
}

function renderClouds(context, clouds) {
  clouds.forEach((cloud) => renderCloud(context, cloud));
}

function createSailplane(canvasWidth, canvasHeight) {
  return {
    width: 60,
    height: 20,
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    color: "#ffffff",
    velocityY: 0,
    isColliding: false,
  };
}

function checkGroundCollision(sailplane, groundY) {
  const sailplaneBottom = sailplane.y + sailplane.height / 2;
  return sailplaneBottom >= groundY;
}

function applySailplaneGravity(sailplane, gravity) {
  return {
    ...sailplane,
    velocityY: sailplane.velocityY + gravity,
  };
}

function setClimbRate(sailplane, climbRate) {
  return {
    ...sailplane,
    velocityY: -climbRate,
  };
}

function setSinkRate(sailplane, sinkRate) {
  return {
    ...sailplane,
    velocityY: sinkRate,
  };
}

function isUnderCloud(sailplane, cloud) {
  const sailplaneLeft = sailplane.x - sailplane.width / 2;
  const sailplaneRight = sailplane.x + sailplane.width / 2;
  const cloudLeft = cloud.x - cloud.width / 2;
  const cloudRight = cloud.x + cloud.width / 2;
  const cloudBottom = cloud.y + cloud.height / 2;

  const horizontalOverlap =
    sailplaneRight > cloudLeft && sailplaneLeft < cloudRight;
  const isBelowCloud = sailplane.y > cloudBottom;

  return horizontalOverlap && isBelowCloud;
}

function findCloudAbove(sailplane, clouds) {
  return clouds.find((cloud) => isUnderCloud(sailplane, cloud));
}

function smoothTransition(currentValue, targetValue, transitionSpeed, deltaTimeMultiplier) {
  const difference = targetValue - currentValue;
  const step =
    Math.sign(difference) * Math.min(Math.abs(difference), transitionSpeed * deltaTimeMultiplier);
  return currentValue + step;
}

function applySailplaneLift(
  sailplane,
  clouds,
  lifecycleConfig,
  sinkRate,
  transitionSpeed,
  deltaTimeMultiplier,
) {
  const cloudAbove = findCloudAbove(sailplane, clouds);
  const climbRate = cloudAbove
    ? getStageClimbRate(cloudAbove.stage, lifecycleConfig)
    : 0;
  const targetVelocity = cloudAbove ? -climbRate : sinkRate;
  const newVelocity = smoothTransition(
    sailplane.velocityY,
    targetVelocity,
    transitionSpeed,
    deltaTimeMultiplier,
  );
  return { ...sailplane, velocityY: newVelocity };
}

function updateSailplanePosition(sailplane, groundY, deltaTimeMultiplier) {
  const newY = sailplane.y + sailplane.velocityY * deltaTimeMultiplier;
  const minY = sailplane.height / 2;
  const maxY = groundY - sailplane.height / 2;
  const clampedY = Math.max(minY, Math.min(maxY, newY));
  const isColliding = checkGroundCollision(
    { ...sailplane, y: clampedY },
    groundY,
  );

  return {
    ...sailplane,
    y: clampedY,
    isColliding: isColliding,
    color: isColliding ? "#e74c3c" : "#ffffff",
  };
}

function renderPaperAirplane(context, x, y, width, height, color, direction) {
  const noseOffsetX = (width / 2) * direction;
  const tailOffsetX = (-width / 2) * direction;
  const notchOffsetX = (-width / 2 + width * 0.3) * direction;
  const wingSpan = height;

  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x + noseOffsetX, y);
  context.lineTo(x + tailOffsetX, y - wingSpan / 2);
  context.lineTo(x + notchOffsetX, y);
  context.lineTo(x + tailOffsetX, y + wingSpan / 2);
  context.closePath();
  context.fill();
}

function renderSailplane(context, sailplane, direction) {
  renderPaperAirplane(
    context,
    sailplane.x,
    sailplane.y,
    sailplane.width,
    sailplane.height,
    sailplane.color,
    direction,
  );
}

function createGameState(isRunning, isGameOver) {
  return { isRunning, isGameOver };
}

function updateMenuTitle(titleElement, text) {
  titleElement.textContent = text;
}

function showMenu(menuElement) {
  menuElement.classList.remove("hidden");
}

function hideMenu(menuElement) {
  menuElement.classList.add("hidden");
}

function renderFrame(
  context,
  canvasElement,
  sailplane,
  ground,
  clouds,
  mountains,
  farTrees,
  nearTrees,
  direction,
) {
  clearCanvas(context, canvasElement.width, canvasElement.height);
  renderMountains(context, mountains);
  renderTrees(context, farTrees);
  renderTrees(context, nearTrees);
  renderClouds(context, clouds);
  renderGround(context, ground, canvasElement.width);
  renderSailplane(context, sailplane, direction);
}

function getGliderAtIndex(gliders, index) {
  const wrappedIndex =
    ((index % gliders.length) + gliders.length) % gliders.length;
  return { glider: gliders[wrappedIndex], index: wrappedIndex };
}

function updateCarouselDisplay(nameElement, statsElement, glider) {
  nameElement.textContent = glider.name;
  statsElement.textContent = "Glide Ratio: " + glider.glideRatio;
}

function calculateHorizontalDistance(currentDistance, speed, pixelsPerMeter, deltaTimeMultiplier) {
  return currentDistance + (speed * deltaTimeMultiplier) / pixelsPerMeter;
}

function calculateDistanceFromStart(horizontalMeters, startY, currentY, pixelsPerMeter) {
  const verticalMeters = (currentY - startY) / pixelsPerMeter;
  return Math.sqrt(horizontalMeters * horizontalMeters + verticalMeters * verticalMeters);
}

function formatDistance(distance) {
  return Math.floor(distance) + " m";
}

function updateDistanceDisplay(element, distance) {
  element.textContent = formatDistance(distance);
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const menu = document.getElementById("menu");
  const menuTitle = document.getElementById("menuTitle");
  const startButton = document.getElementById("startButton");
  const carouselLeft = document.getElementById("carouselLeft");
  const carouselRight = document.getElementById("carouselRight");
  const gliderName = document.getElementById("gliderName");
  const gliderStats = document.getElementById("gliderStats");
  const distanceDisplay = document.getElementById("distanceDisplay");
  const context = initializeCanvas(canvas);
  let selectedGliderIndex = 1;
  let currentSinkRate = GLIDER_CONFIGURATIONS[selectedGliderIndex].sinkRate;
  let currentSpeedMultiplier =
    GLIDER_CONFIGURATIONS[selectedGliderIndex].speedMultiplier;

  let gameState = createGameState(false, false);
  let ground = createGround(canvas.height);
  let clouds = createClouds(
    canvas.width,
    canvas.height,
    CLOUD_LIFECYCLE_CONFIG,
  );
  let mountains = createMountains(canvas.width, canvas.height);
  let farTrees = createFarTrees(canvas.width, canvas.height);
  let nearTrees = createNearTrees(canvas.width, canvas.height);
  let sailplane = createSailplane(canvas.width, canvas.height);
  let targetDirection = 1;
  let currentDirection = 1;
  let horizontalDistanceTraveled = 0;
  let startY = canvas.height / 2;
  let timeState = createTimeState(performance.now());

  distanceDisplay.classList.add("hidden");

  function resetGame() {
    ground = createGround(canvas.height);
    clouds = createClouds(canvas.width, canvas.height, CLOUD_LIFECYCLE_CONFIG);
    mountains = createMountains(canvas.width, canvas.height);
    farTrees = createFarTrees(canvas.width, canvas.height);
    nearTrees = createNearTrees(canvas.width, canvas.height);
    sailplane = createSailplane(canvas.width, canvas.height);
    targetDirection = 1;
    currentDirection = 1;
    horizontalDistanceTraveled = 0;
    startY = sailplane.y;
  }

  startButton.addEventListener("click", () => {
    if (gameState.isGameOver) {
      resetGame();
    }
    startY = sailplane.y;
    currentSinkRate = GLIDER_CONFIGURATIONS[selectedGliderIndex].sinkRate;
    currentSpeedMultiplier =
      GLIDER_CONFIGURATIONS[selectedGliderIndex].speedMultiplier;
    updateMenuTitle(menuTitle, "Sail Sweep");
    gameState = createGameState(true, false);
    hideMenu(menu);
    distanceDisplay.classList.remove("hidden");
    const distanceFromStart = calculateDistanceFromStart(
      horizontalDistanceTraveled,
      startY,
      sailplane.y,
      GAME_CONFIG.pixelsPerMeter
    );
    updateDistanceDisplay(distanceDisplay, distanceFromStart);
  });

  carouselLeft.addEventListener("click", () => {
    const result = getGliderAtIndex(
      GLIDER_CONFIGURATIONS,
      selectedGliderIndex - 1,
    );
    selectedGliderIndex = result.index;
    updateCarouselDisplay(gliderName, gliderStats, result.glider);
  });

  carouselRight.addEventListener("click", () => {
    const result = getGliderAtIndex(
      GLIDER_CONFIGURATIONS,
      selectedGliderIndex + 1,
    );
    selectedGliderIndex = result.index;
    updateCarouselDisplay(gliderName, gliderStats, result.glider);
  });

  canvas.addEventListener("click", () => {
    if (gameState.isRunning) {
      targetDirection = -targetDirection;
    }
  });

  function gameLoop(currentTime) {
    timeState = updateTimeState(timeState, currentTime);
    const deltaTimeMultiplier = calculateDeltaTimeMultiplier(
      timeState.deltaTime,
      GAME_CONFIG.targetFPS,
    );

    if (!gameState.isRunning) {
      renderFrame(
        context,
        canvas,
        sailplane,
        ground,
        clouds,
        mountains,
        farTrees,
        nearTrees,
        currentDirection,
      );
      requestAnimationFrame(gameLoop);
      return;
    }

    ground = createGround(canvas.height);

    currentDirection = smoothTransition(
      currentDirection,
      targetDirection,
      GAME_CONFIG.directionTransitionSpeed,
      deltaTimeMultiplier,
    );

    const cloudSpeed = GAME_CONFIG.baseCloudSpeed * currentSpeedMultiplier;
    const mountainSpeed =
      GAME_CONFIG.baseMountainSpeed * currentSpeedMultiplier;
    const farTreeSpeed = GAME_CONFIG.baseFarTreeSpeed * currentSpeedMultiplier;
    const nearTreeSpeed =
      GAME_CONFIG.baseNearTreeSpeed * currentSpeedMultiplier;

    clouds = updateClouds(
      clouds,
      cloudSpeed,
      canvas.width,
      canvas.height,
      GAME_CONFIG.minCloudSpacing,
      GAME_CONFIG.maxCloudSpacing,
      currentDirection,
      CLOUD_LIFECYCLE_CONFIG,
      deltaTimeMultiplier,
    );
    mountains = updateMountains(
      mountains,
      mountainSpeed,
      currentDirection,
      canvas.width,
      deltaTimeMultiplier,
    );
    farTrees = updateTrees(
      farTrees,
      farTreeSpeed,
      currentDirection,
      canvas.width,
      deltaTimeMultiplier,
    );
    nearTrees = updateTrees(
      nearTrees,
      nearTreeSpeed,
      currentDirection,
      canvas.width,
      deltaTimeMultiplier,
    );
    sailplane = {
      ...sailplane,
      x: canvas.width / 2,
    };

    sailplane = applySailplaneLift(
      sailplane,
      clouds,
      CLOUD_LIFECYCLE_CONFIG,
      currentSinkRate,
      GAME_CONFIG.velocityTransitionSpeed,
      deltaTimeMultiplier,
    );

    sailplane = updateSailplanePosition(sailplane, ground.y, deltaTimeMultiplier);

    horizontalDistanceTraveled = calculateHorizontalDistance(
      horizontalDistanceTraveled,
      cloudSpeed,
      GAME_CONFIG.pixelsPerMeter,
      deltaTimeMultiplier,
    );
    const distanceFromStart = calculateDistanceFromStart(
      horizontalDistanceTraveled,
      startY,
      sailplane.y,
      GAME_CONFIG.pixelsPerMeter
    );
    updateDistanceDisplay(distanceDisplay, distanceFromStart);

    if (sailplane.isColliding) {
      gameState = createGameState(false, true);
      updateMenuTitle(menuTitle, "Game Over");
      showMenu(menu);
      distanceDisplay.classList.add("hidden");
    }

    renderFrame(
      context,
      canvas,
      sailplane,
      ground,
      clouds,
      mountains,
      farTrees,
      nearTrees,
      currentDirection,
    );
    requestAnimationFrame(gameLoop);
  }

  gameLoop(performance.now());
});
