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

function updateMountainPosition(mountain, speed, direction, canvasWidth) {
  const newX = mountain.x - speed * direction;
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

function updateMountains(mountains, speed, direction, canvasWidth) {
  return mountains.map((mountain) =>
    updateMountainPosition(mountain, speed, direction, canvasWidth),
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

function updateTreePosition(tree, speed, direction, canvasWidth) {
  const newX = tree.x - speed * direction;
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

function updateTrees(trees, speed, direction, canvasWidth) {
  return trees.map((tree) =>
    updateTreePosition(tree, speed, direction, canvasWidth),
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

function createClouds(canvasWidth, canvasHeight) {
  const cloudY = canvasHeight * 0.1;
  return [
    {
      x: canvasWidth * 0.2,
      y: cloudY,
      baseWidth: 120,
      baseHeight: 40,
      width: 120,
      height: 40,
      color: "#ecf0f1",
      liftStrength: 1.6 + Math.random() * 0.8,
      stage: "big",
      age: 200,
      updateInterval: 1 + Math.floor(Math.random() * 3),
    },
    {
      x: canvasWidth * 0.5,
      y: cloudY + 20,
      baseWidth: 100,
      baseHeight: 35,
      width: 100,
      height: 35,
      color: "#ecf0f1",
      liftStrength: 1.6 + Math.random() * 0.8,
      stage: "big",
      age: 200,
      updateInterval: 1 + Math.floor(Math.random() * 3),
    },
    {
      x: canvasWidth * 0.8,
      y: cloudY - 10,
      baseWidth: 140,
      baseHeight: 45,
      width: 140,
      height: 45,
      color: "#ecf0f1",
      liftStrength: 1.6 + Math.random() * 0.8,
      stage: "big",
      age: 200,
      updateInterval: 1 + Math.floor(Math.random() * 3),
    },
  ];
}

function getRandomCloudStage() {
  const stages = ["invisible", "small", "big", "dying"];
  const randomIndex = Math.floor(Math.random() * stages.length);
  return stages[randomIndex];
}

function calculateAgeForStage(
  stage,
  invisibleDuration,
  smallDuration,
  bigDuration,
  updateInterval,
) {
  const stageStartAges = {
    invisible: 0,
    small: invisibleDuration,
    big: invisibleDuration + smallDuration,
    dying: invisibleDuration + smallDuration + bigDuration,
  };
  const baseAge = stageStartAges[stage] * updateInterval;
  return baseAge;
}

function createRandomCloud(
  canvasWidth,
  canvasHeight,
  direction,
  invisibleDuration,
  smallDuration,
  bigDuration,
) {
  const cloudY = canvasHeight * 0.1;
  const yVariation = (Math.random() - 0.5) * 60;
  const baseWidth = 60 + Math.random() * 40;
  const baseHeight = 20 + Math.random() * 15;
  const spawnX = direction > 0 ? canvasWidth + baseWidth / 2 : -baseWidth / 2;
  const liftStrength = 1.6 + Math.random() * 0.8;
  const updateInterval = 1 + Math.floor(Math.random() * 3);
  const stage = getRandomCloudStage();
  console.log(stage);
  const age = calculateAgeForStage(
    stage,
    invisibleDuration,
    smallDuration,
    bigDuration,
    updateInterval,
  );
  const stageProperties = getCloudStageProperties(stage, baseWidth, baseHeight);

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
  };
}

function getCloudStageProperties(stage, baseWidth, baseHeight) {
  const stages = {
    invisible: { sizeMultiplier: 0, color: "transparent" },
    small: { sizeMultiplier: 0.6, color: "#ecf0f1" },
    big: { sizeMultiplier: 1.0, color: "#ecf0f1" },
    dying: { sizeMultiplier: 0.7, color: "#bdc3c7" },
  };
  const properties = stages[stage];
  return {
    width: baseWidth * properties.sizeMultiplier,
    height: baseHeight * properties.sizeMultiplier,
    color: properties.color,
  };
}

function advanceCloudStage(
  cloud,
  invisibleDuration,
  smallDuration,
  bigDuration,
) {
  const newAge = cloud.age + 1;
  const shouldUpdate = newAge % cloud.updateInterval === 0;

  if (!shouldUpdate) {
    return { ...cloud, age: newAge };
  }

  let newStage = cloud.stage;
  let dyingAge = cloud.dyingAge || 0;
  const effectiveAge = Math.floor(newAge / cloud.updateInterval);

  if (cloud.stage === "invisible" && effectiveAge >= invisibleDuration) {
    newStage = "small";
  } else if (
    cloud.stage === "small" &&
    effectiveAge >= invisibleDuration + smallDuration
  ) {
    newStage = "big";
  } else if (
    cloud.stage === "big" &&
    effectiveAge >= invisibleDuration + smallDuration + bigDuration
  ) {
    newStage = "dying";
  }

  if (newStage === "dying") {
    dyingAge = cloud.dyingAge !== undefined ? cloud.dyingAge + 1 : 1;
  }

  const stageProperties = getCloudStageProperties(
    newStage,
    cloud.baseWidth,
    cloud.baseHeight,
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

function removeExpiredClouds(clouds, dyingDuration) {
  return clouds.filter((cloud) => {
    if (cloud.stage !== "dying") return true;
    return (cloud.dyingAge || 0) < dyingDuration;
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

function shouldSpawnCloud(clouds, canvasWidth, minSpacing, direction) {
  if (clouds.length === 0) return true;

  if (direction > 0) {
    const rightmostCloud = clouds.reduce(
      (max, cloud) => (cloud.x > max.x ? cloud : max),
      clouds[0],
    );
    return rightmostCloud.x < canvasWidth - minSpacing;
  } else {
    const leftmostCloud = clouds.reduce(
      (min, cloud) => (cloud.x < min.x ? cloud : min),
      clouds[0],
    );
    return leftmostCloud.x > minSpacing;
  }
}

function spawnCloudIfNeeded(
  clouds,
  canvasWidth,
  canvasHeight,
  minSpacing,
  direction,
  invisibleDuration,
  smallDuration,
  bigDuration,
) {
  if (shouldSpawnCloud(clouds, canvasWidth, minSpacing, direction)) {
    return [
      ...clouds,
      createRandomCloud(
        canvasWidth,
        canvasHeight,
        direction,
        invisibleDuration,
        smallDuration,
        bigDuration,
      ),
    ];
  }
  return clouds;
}

function updateCloudPosition(cloud, speed, direction) {
  return { ...cloud, x: cloud.x - speed * direction };
}

function updateClouds(
  clouds,
  speed,
  canvasWidth,
  canvasHeight,
  minSpacing,
  direction,
  invisibleDuration,
  smallDuration,
  bigDuration,
  dyingDuration,
) {
  const agedClouds = clouds.map((cloud) =>
    advanceCloudStage(cloud, invisibleDuration, smallDuration, bigDuration),
  );
  const movedClouds = agedClouds.map((cloud) =>
    updateCloudPosition(cloud, speed, direction),
  );
  const withoutExpired = removeExpiredClouds(movedClouds, dyingDuration);
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
    direction,
    invisibleDuration,
    smallDuration,
    bigDuration,
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

function smoothVelocityTransition(
  currentVelocity,
  targetVelocity,
  transitionSpeed,
) {
  const difference = targetVelocity - currentVelocity;
  const step =
    Math.sign(difference) * Math.min(Math.abs(difference), transitionSpeed);
  return currentVelocity + step;
}

function getStageClimbRate(stage, stageClimbRates) {
  return stageClimbRates[stage] || stageClimbRates.small;
}

function applySailplaneLift(
  sailplane,
  clouds,
  stageClimbRates,
  sinkRate,
  transitionSpeed,
) {
  const cloudAbove = findCloudAbove(sailplane, clouds);
  const climbRate = cloudAbove
    ? getStageClimbRate(cloudAbove.stage, stageClimbRates)
    : 0;
  const targetVelocity = cloudAbove ? -climbRate : sinkRate;
  const newVelocity = smoothVelocityTransition(
    sailplane.velocityY,
    targetVelocity,
    transitionSpeed,
  );
  return { ...sailplane, velocityY: newVelocity };
}

function updateSailplanePosition(sailplane, groundY) {
  const newY = sailplane.y + sailplane.velocityY;
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

function renderSailplane(context, sailplane) {
  const drawX = sailplane.x - sailplane.width / 2;
  const drawY = sailplane.y - sailplane.height / 2;
  drawRectangle(
    context,
    drawX,
    drawY,
    sailplane.width,
    sailplane.height,
    sailplane.color,
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
) {
  clearCanvas(context, canvasElement.width, canvasElement.height);
  renderMountains(context, mountains);
  renderTrees(context, farTrees);
  renderTrees(context, nearTrees);
  renderClouds(context, clouds);
  renderGround(context, ground, canvasElement.width);
  renderSailplane(context, sailplane);
}

function createGliderConfigurations() {
  return [
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
  ];
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

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const menu = document.getElementById("menu");
  const menuTitle = document.getElementById("menuTitle");
  const startButton = document.getElementById("startButton");
  const carouselLeft = document.getElementById("carouselLeft");
  const carouselRight = document.getElementById("carouselRight");
  const gliderName = document.getElementById("gliderName");
  const gliderStats = document.getElementById("gliderStats");
  const context = initializeCanvas(canvas);
  const stageClimbRates = {
    invisible: 1.4,
    small: 1.3,
    big: 1.2,
    dying: 1.1,
  };
  const gliderConfigurations = createGliderConfigurations();
  let selectedGliderIndex = 1;
  let currentSinkRate = gliderConfigurations[selectedGliderIndex].sinkRate;
  let currentSpeedMultiplier =
    gliderConfigurations[selectedGliderIndex].speedMultiplier;
  const velocityTransitionSpeed = 0.1;
  const baseCloudSpeed = 2;
  const baseMountainSpeed = 0.5;
  const baseFarTreeSpeed = 0.75;
  const baseNearTreeSpeed = 1.25;
  const minCloudSpacing = 400;
  const cloudInvisibleDuration = 60;
  const cloudSmallDuration = 120;
  const cloudBigDuration = 300;
  const cloudDyingDuration = 150;

  let gameState = createGameState(false, false);
  let ground = createGround(canvas.height);
  let clouds = createClouds(canvas.width, canvas.height);
  let mountains = createMountains(canvas.width, canvas.height);
  let farTrees = createFarTrees(canvas.width, canvas.height);
  let nearTrees = createNearTrees(canvas.width, canvas.height);
  let sailplane = createSailplane(canvas.width, canvas.height);
  let direction = 1;

  function resetGame() {
    ground = createGround(canvas.height);
    clouds = createClouds(canvas.width, canvas.height);
    mountains = createMountains(canvas.width, canvas.height);
    farTrees = createFarTrees(canvas.width, canvas.height);
    nearTrees = createNearTrees(canvas.width, canvas.height);
    sailplane = createSailplane(canvas.width, canvas.height);
    direction = 1;
  }

  startButton.addEventListener("click", () => {
    if (gameState.isGameOver) {
      resetGame();
    }
    currentSinkRate = gliderConfigurations[selectedGliderIndex].sinkRate;
    currentSpeedMultiplier =
      gliderConfigurations[selectedGliderIndex].speedMultiplier;
    updateMenuTitle(menuTitle, "Sail Sweep");
    gameState = createGameState(true, false);
    hideMenu(menu);
  });

  carouselLeft.addEventListener("click", () => {
    const result = getGliderAtIndex(
      gliderConfigurations,
      selectedGliderIndex - 1,
    );
    selectedGliderIndex = result.index;
    updateCarouselDisplay(gliderName, gliderStats, result.glider);
  });

  carouselRight.addEventListener("click", () => {
    const result = getGliderAtIndex(
      gliderConfigurations,
      selectedGliderIndex + 1,
    );
    selectedGliderIndex = result.index;
    updateCarouselDisplay(gliderName, gliderStats, result.glider);
  });

  canvas.addEventListener("click", () => {
    if (gameState.isRunning) {
      direction = -direction;
    }
  });

  function gameLoop() {
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
      );
      requestAnimationFrame(gameLoop);
      return;
    }

    ground = createGround(canvas.height);

    const cloudSpeed = baseCloudSpeed * currentSpeedMultiplier;
    const mountainSpeed = baseMountainSpeed * currentSpeedMultiplier;
    const farTreeSpeed = baseFarTreeSpeed * currentSpeedMultiplier;
    const nearTreeSpeed = baseNearTreeSpeed * currentSpeedMultiplier;

    clouds = updateClouds(
      clouds,
      cloudSpeed,
      canvas.width,
      canvas.height,
      minCloudSpacing,
      direction,
      cloudInvisibleDuration,
      cloudSmallDuration,
      cloudBigDuration,
      cloudDyingDuration,
    );
    mountains = updateMountains(
      mountains,
      mountainSpeed,
      direction,
      canvas.width,
    );
    farTrees = updateTrees(farTrees, farTreeSpeed, direction, canvas.width);
    nearTrees = updateTrees(nearTrees, nearTreeSpeed, direction, canvas.width);
    sailplane = {
      ...sailplane,
      x: canvas.width / 2,
    };

    sailplane = applySailplaneLift(
      sailplane,
      clouds,
      stageClimbRates,
      currentSinkRate,
      velocityTransitionSpeed,
    );

    sailplane = updateSailplanePosition(sailplane, ground.y);

    if (sailplane.isColliding) {
      gameState = createGameState(false, true);
      updateMenuTitle(menuTitle, "Game Over");
      showMenu(menu);
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
    );
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
