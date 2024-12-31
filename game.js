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
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  scene.background = new THREE.Color(0x000000);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
}
