const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-links");
const contactForm = document.querySelector(".contact-form");
const thankYouModal = document.querySelector(".thank-you-modal");
const modalCloseButtons = document.querySelectorAll(".modal-close, .modal-ok");
const submitButton = contactForm?.querySelector('button[type="submit"]');
const heroCanvas = document.querySelector("#hero-3d-canvas");

const initHeroScene = async () => {
  if (!heroCanvas) {
    return;
  }

  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      alpha: true,
      antialias: true,
    });
    const root = new THREE.Group();
    const clock = new THREE.Clock();

    camera.position.set(0, 1.2, 10.8);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene.add(root);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9bc9ff, 2.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 7, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffd166, 8, 18);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    const makeMaterial = (color, roughness = 0.55, metalness = 0.03) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });

    const textTexture = (text, background, foreground = "#17324d") => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = foreground;
      context.font = "900 128px Nunito, Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, 128, 136);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createBlock = (text, color, position, rotation) => {
      const materials = [
        makeMaterial(color),
        makeMaterial(color),
        makeMaterial(color),
        makeMaterial(color),
        new THREE.MeshStandardMaterial({ map: textTexture(text, color) }),
        makeMaterial(color),
      ];
      const block = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.18, 1.18), materials);
      block.castShadow = true;
      block.receiveShadow = true;
      block.position.set(...position);
      block.rotation.set(...rotation);
      root.add(block);
      return block;
    };

    const createBook = (cover, position, rotation, scale = 1) => {
      const book = new THREE.Group();
      const pages = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.16, 1.08), makeMaterial(0xfffbf0, 0.72));
      const coverTop = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 1.18), makeMaterial(cover, 0.42));
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.34, 1.22), makeMaterial(0x17324d, 0.45));
      pages.position.y = 0;
      coverTop.position.y = 0.17;
      spine.position.x = -1.02;
      spine.position.y = 0.08;
      book.add(pages, coverTop, spine);
      book.children.forEach((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
      book.position.set(...position);
      book.rotation.set(...rotation);
      book.scale.setScalar(scale);
      root.add(book);
      return book;
    };

    const createPencil = (position, rotation, color) => {
      const pencil = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.25, 24), makeMaterial(color, 0.38));
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.36, 24), makeMaterial(0xf4c27a, 0.5));
      const point = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.16, 18), makeMaterial(0x243447, 0.45));
      const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.26, 24), makeMaterial(0xff8fab, 0.48));
      body.rotation.z = Math.PI / 2;
      tip.rotation.z = -Math.PI / 2;
      point.rotation.z = -Math.PI / 2;
      eraser.rotation.z = Math.PI / 2;
      tip.position.x = 1.29;
      point.position.x = 1.55;
      eraser.position.x = -1.25;
      pencil.add(body, tip, point, eraser);
      pencil.children.forEach((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
      pencil.position.set(...position);
      pencil.rotation.set(...rotation);
      root.add(pencil);
      return pencil;
    };

    const createPlus = () => {
      const plus = new THREE.Group();
      const material = makeMaterial(0x28c7c0, 0.42);
      const barA = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.24, 0.24), material);
      const barB = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.2, 0.24), material);
      barA.castShadow = true;
      barB.castShadow = true;
      plus.add(barA, barB);
      plus.position.set(3.15, 1.2, -0.8);
      plus.rotation.set(0.2, -0.45, 0.18);
      root.add(plus);
      return plus;
    };

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4.9, 96),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8,
        transparent: true,
        opacity: 0.42,
      })
    );
    floor.position.set(0, -2.05, -0.35);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    root.add(floor);

    const objects = [
      createBlock("A", 0xffd166, [-1.7, 0.05, 0.3], [0.2, -0.45, -0.12]),
      createBlock("1", 0xff8fab, [0.08, 0.74, -0.25], [-0.2, 0.55, 0.16]),
      createBlock("+", 0x74c69d, [1.8, -0.02, 0.2], [0.16, 0.7, -0.14]),
      createBook(0x2684ff, [-2.65, -1.16, -0.15], [-0.22, -0.42, 0.12], 1.08),
      createBook(0xff6b6b, [-0.5, -1.46, 0.4], [0.18, 0.1, -0.08], 1),
      createPencil([2.72, -1.0, 0.12], [0.18, -0.28, 0.85], 0xff9f1c),
      createPlus(),
    ];

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.07, 16, 64),
      makeMaterial(0x7b61ff, 0.34)
    );
    torus.position.set(-3.15, 1.38, -0.7);
    torus.rotation.set(0.8, 0.6, 0.1);
    torus.castShadow = true;
    root.add(torus);
    objects.push(torus);

    const ribbon = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.54, 0.055, 90, 10),
      makeMaterial(0xff6b6b, 0.5)
    );
    ribbon.position.set(2.9, 1.82, -1.25);
    ribbon.rotation.set(0.2, 0.4, 0.9);
    ribbon.castShadow = true;
    root.add(ribbon);
    objects.push(ribbon);

    const resize = () => {
      const rect = heroCanvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.position.z = width < 520 ? 11.3 : 10.8;
      root.scale.setScalar(width < 520 ? 0.76 : width < 760 ? 0.82 : 0.86);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      root.rotation.y = Math.sin(elapsed * 0.35) * 0.08;
      root.position.y = Math.sin(elapsed * 0.55) * 0.08;

      objects.forEach((object, index) => {
        object.rotation.x += 0.002 + index * 0.0002;
        object.rotation.y += 0.004 + index * 0.00025;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    resize();
    new ResizeObserver(resize).observe(heroCanvas);
    animate();
  } catch (error) {
    console.warn("3D hero scene could not load.", error);
    const fallback = document.createElement("img");
    fallback.src = "assets/hero-learning.png";
    fallback.alt = "Children learning happily with a teacher in a colorful classroom";
    heroCanvas.replaceWith(fallback);
  }
};

initHeroScene();

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    if (!contactForm.checkValidity()) {
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    window.setTimeout(() => {
      if (submitButton) {
        submitButton.textContent = "Done";
      }
      thankYouModal?.removeAttribute("hidden");
      document.body.classList.add("modal-open");
      contactForm.reset();
    }, 350);
  });
}

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    thankYouModal?.setAttribute("hidden", "");
    document.body.classList.remove("modal-open");
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Send";
    }
  });
});

thankYouModal?.addEventListener("click", (event) => {
  if (event.target === thankYouModal) {
    thankYouModal.setAttribute("hidden", "");
    document.body.classList.remove("modal-open");
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Send";
    }
  }
});
