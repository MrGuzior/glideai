Follow these rules:

1. Be pure where possible

2. Do the best you can.

3. Have no side effects unless explicitly requested

4. Not access global state directly

5. Accept dependencies via parameters

6. Be testable in isolation

7. Refer to my always as Konrad

8. Always have descriptive names

9. Files to work in and only in those files,
   [
   ./game.js
   ./index.html
   ./main.css
   ]

10. Do those things only one at a time then cut the completed line paste it into list under point number 12.
    [
    <!-- Make the clouds bigger and more random -->
    ]

11. Refactor the code you just wrote and see if it can be made even easier and even more readable

12. Commits:
    [

- 2026-02-08: Created simple index.html with basic structure and greeting
- 2026-02-08: Built map application with header, search/list/create buttons, and map container using semantic HTML and embedded CSS
- 2026-02-08: Replaced map structure with game canvas element, updated styling for dark gaming theme with centered canvas
- 2026-02-08 14:32: Simplified to fullscreen canvas with no navbar, minimal CSS for pure game display
- 2026-02-08 14:35: Created game.js with pure functions for canvas operations, rendering utilities, and game loop
- 2026-02-08 14:42: Added sailplane as white rectangle centered on screen with pure functions for creation, position update, and rendering
- 2026-02-08 14:48: Added green ground at bottom of screen and gravity system causing glider to fall over time
- 2026-02-08 14:55: Moved ground up 30% from bottom, added collision detection with checkGroundCollision, glider turns red on ground contact
- 2026-02-08 15:02: Added clouds array at 10% from top with createClouds, renderCloud, and renderClouds pure functions
- 2026-02-08 15:10: Added cloud movement with updateCloudPosition and updateClouds pure functions, clouds loop from right side
- 2026-02-08 15:18: Implemented endless cloud spawning with createRandomCloud, removeOffscreenClouds, shouldSpawnCloud, and spawnCloudIfNeeded pure functions
- 2026-02-08 15:25: Reduced gravity from 0.1 to 0.05 to make glider fall 50% slower
- 2026-02-08 15:32: Added lift mechanic with isUnderCloud, isUnderAnyCloud, and applyLift pure functions, glider climbs under clouds and sinks otherwise
- 2026-02-08 15:48: Added direction toggle on click, updated cloud functions to accept direction parameter for bidirectional flight simulation
- 2026-02-08 16:02: Replaced accumulating velocity with direct rate setting using setClimbRate and setSinkRate for instant lift/sink transitions
- 2026-02-08 16:10: Increased minCloudSpacing from 200 to 400 to make clouds more sparse
- 2026-02-08 16:18: Added random liftStrength (0.8-1.4) to each cloud, replaced fixed climb rate with cloud-specific lift values using findCloudAbove and getCloudLiftStrength
- 2026-02-08 16:25: Adjusted liftStrength range from 0.8-1.4 to 1.6-2.4 ensuring all clouds provide lift greater than sink rate (1.5)
- 2026-02-08 16:35: Fixed initial clouds missing liftStrength property in createClouds function, now all clouds provide lift
- 2026-02-08 16:45: Simplified lift logic to use constant climbRate instead of per-cloud liftStrength, removed unused getCloudLiftStrength and applyLift functions
- 2026-02-08 16:55: Added parallax mountain background with createMountains, updateMountains, and renderMountains pure functions, mountains move at 0.25x cloud speed
- 2026-02-08 17:15: Added simple menu with Start button, createGameState, showMenu, hideMenu, applySailplaneLift pure functions, game pauses until Start is clicked
- 2026-02-08 17:25: Added game over state with updateMenuTitle pure function, menu shows "Game Over" on ground collision, resetGame restarts flight
- 2026-02-08 17:35: Added landscape-only mode with CSS portrait media query, rotate overlay shows phone emoji and message when in portrait orientation
- 2026-02-08 17:45: Created main.css and moved all styling from index.html, linked stylesheet in head
- 2026-02-08 17:55: Moved ground to bottom of screen by removing groundOffset in createGround function
- 2026-02-08 18:05: Added trees parallax layer with createTrees, updateTrees, renderTrees pure functions, trees move at 1.0x speed between mountains (0.5x) and clouds (2x)
- 2026-02-08 18:15: Split trees into farTrees (0.75x speed, smaller, higher) and nearTrees (1.25x speed, larger, lower) for depth effect
- 2026-02-08 18:25: Added smooth vertical velocity transitions with smoothVelocityTransition pure function, velocityTransitionSpeed of 0.1 for gradual lift/sink changes
- 2026-02-08 18:35: Lowered climbRate from 2 to 1.7 for more challenging gameplay
- 2026-02-08 18:45: Added cloud development stages (small->big->dying) with getCloudStageProperties, advanceCloudStage pure functions, dying clouds turn gray (#bdc3c7)
- 2026-02-08 18:55: Added individual cloud update cycles with updateInterval property (1-3), each cloud advances stages at its own predictable pace
- 2026-02-08 19:05: Added removeExpiredClouds pure function with dyingAge tracking, gray clouds disappear after cloudDyingDuration (150) frames
- 2026-02-08 19:15: Added invisible cloud stage before small with cloudInvisibleDuration (60), added getStageClimbRate and stageClimbRates object for stage-based climb rates (invisible: 2.0 strong, small: 1.2 moderate, big: 2.5 best, dying: 1.2 moderate)
- 2026-02-08 19:30: Added glider selection carousel in menu with createGliderConfigurations, getGliderAtIndex, updateCarouselDisplay pure functions. Three gliders: Training (20:1, sink 1.8), Standard (30:1, sink 1.5), Competition (45:1, sink 1.2)
- 2026-02-08: Added speedMultiplier property to glider configurations, better gliders now move faster horizontally. Training (1.0x), Standard (1.3x), Competition (1.8x) speed multipliers applied to clouds, mountains, and trees movement.
- 2026-02-08: Added random cloud spawn states with getRandomCloudStage and calculateAgeForStage pure functions, clouds now spawn in any stage (invisible, small, big, dying) with correct visual properties and age.
- 2026-02-08: Added inline SVG favicon with simple glider shape, updated app name to Sail Sweep in title, menu title, and game restart title.
- 2026-02-08: Made cloud cycles faster (halved base durations) and more random with generateRandomDurations pure function giving each cloud 0.5x-1.5x multiplier. Clouds now store per-cloud durations object, advanceCloudStage and removeExpiredClouds use cloud's own durations.
- 2026-02-08: Added smooth horizontal speed transition with smoothTransition pure function, targetDirection/currentDirection state variables, and directionTransitionSpeed (0.05) for gradual direction changes on click.
- 2026-02-08: Replaced rectangle glider with paper airplane shape using renderPaperAirplane pure function drawing triangular streamlined shape with nose, tail, and wing points.
- 2026-02-08: Added turn animation to glider by passing direction through renderFrame, renderSailplane, and renderPaperAirplane. Direction value (-1 to 1) scales x-offsets to smoothly flip the airplane during turns.
- 2026-02-08: Made cloud distribution random with getDistanceToEdge pure function, minCloudSpacing (200) and maxCloudSpacing (500). Clouds spawn with random chance between min/max, guaranteed spawn at max distance.
  ]

12. Move the used command here:
[
   <!-- Make the clouds bigger and more random -->

   <!-- Put all the "config", "data" on top of the file so it's easily findable and changable -->

   <!-- Refactor the cloud lifecycle code. Set min size and max size and then how many stages it is supposed to have. Same with the strength. -->

   <!-- create a simple index.html -->

   <!-- add pure html structure for an app with a map as it's start page with buttons to search and to list stuff and create stuff -->

   <!-- Let's drop the map idea and prepare it as a canvas for a game we will write -->

   <!-- Make the canvas cover the entire screen, no navbar -->

   <!-- add a js file and connect it to the canvas -->

   <!-- Create an object to act as a sailplane to be fixed in the middle of the screen, right now make it into a rectangle. It is going to move up and down. -->

   <!-- Make green ground -->

   <!-- Add the invisible stage which comes just before small cloud -->

   <!-- Make the different stages have different climb rates: invisible strong, small moderate, big best, dying moderate -->
   <!-- Make the glider loose height over time and make it fall towards the ground -->

   <!-- move the ground up the screen and make the glider colide with it on touch -->
   <!-- when touched the glider should turn red -->

   <!-- create clouds object and place it high up over the glider -->

   <!-- make the clouds fly by as if the glider is moving forwards -->

   <!-- make the clouds spawn endlessly -->

   <!-- Make the glider fall slower -->

   <!-- the clouds produce lift, so whenever glider is under cloud it climbs and sinks when not under clouds -->

   <!-- On screen click change the horizontal direction of the flight by making the clouds go in another direction -->

   <!-- No delay in the vertical velocity when transitioning from lift to sink and the same the other way -->

   <!-- Make clouds more sparse -->

   <!-- make the lift value a bit weaker and make it random -->

   <!-- The lift can shall always be greater than the gliders rate of sink -->

   <!-- the glider should always go up when under clouds. Right now it just falls, something is wrong -->

   <!-- use climbRate -->

   <!-- Add some simple background that looks like mountains in the distance moving slower than the clouds -->

   <!-- Add a simple menu with one button to start the game -->

   <!-- When glider touches the ground the flight is over and a game over menu is shown with the same button as in the start menu to restart the game -->

   <!-- Make the game only playable in horizontal screen mode since it is a mobile game. -->

   <!-- Add main.css and move all the styling there. -->

   <!-- Move the ground height to the bottom -->

   <!-- In front of the mountains, as the second background make it trees , very simple design. Their speed should be in between the speed of the mountins in the background and the clouds for the feeling of depth. -->

   <!-- Add more trees , some closer some further away. -->

   <!-- Make the gliders vertical speed transition smooth -->

   <!-- Lower the climb rate -->

   <!-- Make the clouds have development stages: small cloud -> big cloud -> smaller dying cloud with gray color -->

   <!-- Do not update all the clouds at once, do it randomly but with predictible cycle for each cloud -->

   <!-- Remove the gray clouds after a while and add new forming clouds -->

   <!-- make a scroll select carrousel in the menu presenting three different gliders with different glide ratio -->

   <!-- Make better gliders horizontal speed bigger -->

   <!-- Make the clouds appear in random states. -->

   <!-- Add a simple Sail Sweep favicon. -->

   <!-- Update all copy to the name of the app Sail Sweep. -->

   <!-- make cloud cycles faster and more random -->

]

14. You are done
