const startButton = document.getElementById("start-button");
const menu = document.getElementById("menu");
const gun = Gun({ peers: [], localStorage: true }); // Local-only mode

// Check if Three.js is loaded
console.log("Three.js version:", THREE?.REVISION);

startButton.addEventListener("click", () => {
  menu.style.display = "none";
  initializeGame();
});

function initializeGame() {
  let playerWorld;

  // Check for existing worlds or create a new one
  gun.get("worlds").once((data) => {
    if (data) {
      const existingWorlds = Object.keys(data).filter((key) => key !== "_");
      if (existingWorlds.length > 0) {
        playerWorld = existingWorlds[0];
        console.log(`Joining world: ${playerWorld}`);
        start3DGame(playerWorld);
        return;
      }
    }

    playerWorld = `world-${Date.now()}`;
    console.log(`Creating world: ${playerWorld}`);
    gun.get("worlds").get(playerWorld).put({ created: true });
    start3DGame(playerWorld);
  });
}

function start3DGame(worldName) {
  console.log(`Starting 3D game in world: ${worldName}`);

  // Set up Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Handle window resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Add a black background
  scene.background = new THREE.Color(0x000000);

  // Add a basic cube as a placeholder "player"
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Position camera
  camera.position.z = 5;

  // Game loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();
}
