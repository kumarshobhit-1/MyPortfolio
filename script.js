
// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 1000);
    }, 1500);
});

// Enhanced Mobile Navigation JavaScript
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');
let isMenuOpen = false;

// Toggle mobile menu
menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        navLinks.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
    } else {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
});

// Close menu when clicking nav links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            isMenuOpen = false;
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMenuOpen && !navbar.contains(e.target)) {
        isMenuOpen = false;
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
});

// Handle escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    if (isMenuOpen) {
        setTimeout(() => {
            isMenuOpen = false;
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
        }, 100);
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced resize handling for Three.js
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Resize about section 3D if exists
        const aboutContainer = document.getElementById('about3d');
        if (aboutContainer && aboutContainer.querySelector('canvas')) {
            const aboutRenderer = aboutContainer.querySelector('canvas');
            if (aboutRenderer && aboutContainer.clientWidth > 0) {
                // Trigger resize for about section
                window.dispatchEvent(new Event('aboutResize'));
            }
        }
    }, 100);
});

// Better touch handling for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    // Close mobile menu on upward swipe
    if (diff > swipeThreshold && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Intersection Observer with better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Form submission with dynamic message
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
        showFormMsg('Please fill all fields.', true);
        return;
    }

    try {
        const res = await fetch('https://formspree.io/f/xblabvnb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        if (res.ok) {
            form.reset();
            showFormMsg('Thank you for your message! I will get back to you soon.', false);
        } else {
            showFormMsg('Sorry, there was a problem sending your message.', true);
        }
    } catch {
        showFormMsg('Sorry, there was a problem sending your message.', true);
    }
});

// Dynamic message function
function showFormMsg(msg, isError) {
    const el = document.getElementById('formSuccessMsg');
    el.textContent = msg;
    el.style.background = isError
        ? 'linear-gradient(45deg,#ff4d4d,#ffb199)'
        : 'linear-gradient(45deg,#00ffcc,#0099ff)';
    el.style.color = isError ? '#fff' : '#222';
    el.style.display = 'block';
    el.style.opacity = '1';
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => { el.style.display = 'none'; }, 400);
    }, 2600);
}

// Three.js Hero Scene
let scene, camera, renderer, mouseX = 0,
    mouseY = 0;

function initHeroScene() {
    const container = document.getElementById('canvas-container');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Add ambient floating elements
    const floatingGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    for (let i = 0; i < 20; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x00ffcc : 0x0099ff,
            transparent: true,
            opacity: 0.3
        });
        const sphere = new THREE.Mesh(floatingGeometry, material);
        sphere.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50
        );
        sphere.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            )
        };
        scene.add(sphere);
    }

    // Mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Animate floating elements
        scene.children.forEach(child => {
            if (child.userData && child.userData.velocity) {
                child.position.add(child.userData.velocity);

                // Boundary check and bounce
                if (Math.abs(child.position.x) > 50) child.userData.velocity.x *= -1;
                if (Math.abs(child.position.y) > 50) child.userData.velocity.y *= -1;
                if (Math.abs(child.position.z) > 25) child.userData.velocity.z *= -1;

                child.rotation.x += 0.01;
                child.rotation.y += 0.01;
            }
        });

        // Smooth camera movement based on mouse
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}


initHeroScene();
setTimeout(initAboutAnimation, 600);

// Replace About section 3D animation with Tech Stack logos + labels
function initAboutAnimation() {
    const container = document.getElementById('about3d');
    if (!container) return;


    const canvas = container.querySelector('canvas');
    if (canvas) container.removeChild(canvas);


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 75;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.sortObjects = true;
    container.appendChild(renderer.domElement);

    // Root group: slow global spin for full-around visibility
    const root = new THREE.Group();
    scene.add(root);

    // Core and ring
    const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(22, 2),
        new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.5 })
    );
    root.add(core);

    // Tech stack: logo + text label
    const orbitGroup = new THREE.Group();
    root.add(orbitGroup);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    function createGlowSprite(hex, strength = 1) {
        const size = 256;
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const ctx = c.getContext('2d');
        const r = size / 2;
        const grd = ctx.createRadialGradient(r, r, r * 0.1, r, r, r);
        const R = (hex >> 16) & 255,
            G = (hex >> 8) & 255,
            B = hex & 255;
        grd.addColorStop(0, `rgba(${R},${G},${B},${0.35 * strength})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, size, size);
        const tex = new THREE.CanvasTexture(c);
        tex.minFilter = THREE.LinearFilter;
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
        return new THREE.Sprite(mat);
    }

    const techs = [
        { label: 'JavaScript', color: 0xF7DF1E, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { label: 'React', color: 0x61DAFB, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { label: 'Next.js', color: 0x000000, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        { label: 'Node.js', color: 0x68A063, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { label: 'Express.js', color: 0x000000, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { label: 'EJS', color: 0xB4CA65, logo: 'https://www.vectorlogo.zone/logos/ejs/ejs-icon.svg' },
        { label: 'CSS3', color: 0x2965F1, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { label: 'HTML5', color: 0xE44D26, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { label: 'Bootstrap', color: 0x7952B3, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
        { label: 'TailwindCSS', color: 0x06B6D4, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
        { label: 'Git', color: 0xF05033, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { label: 'GitHub', color: 0xFFFFFF, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { label: 'VS Code', color: 0x007ACC, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
        { label: 'IntelliJ IDEA', color: 0x000000, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg' },
        { label: 'Vite', color: 0x646CFF, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg' },
        { label: 'MongoDB', color: 0x47A248, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { label: 'MySQL', color: 0x4479A1, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { label: 'SQL', color: 0x00618A, logo: 'https://www.svgrepo.com/show/331760/sql-database-generic.svg' },
        { label: 'REST API', color: 0x25B9E6, logo: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg' },
        { label: 'Java', color: 0x007396, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { label: 'Firebase', color: 0xFFCA28, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
        { label: 'Cloudinary', color: 0x3448C5, logo: 'https://res.cloudinary.com/cloudinary-marketing/image/upload/v1626263363/brand/Cloudinary_Logo.svg' }
    ];

    const nodes = techs.map(t => {
        const group = new THREE.Group();

        // glow behind logo for contrast
        const glow = createGlowSprite(t.color, 1.2);
        glow.scale.set(7.2, 7.2, 1);
        // bigger logo
        const logo = new THREE.Sprite(new THREE.SpriteMaterial({
            map: loader.load(
                t.logo,
                tex => {
                    tex.encoding = THREE.sRGBEncoding;
                    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    tex.minFilter = THREE.LinearFilter;
                    tex.magFilter = THREE.LinearFilter;
                    tex.needsUpdate = true;
                }
            ),
            transparent: true,
            depthTest: false
        }));
        logo.scale.set(5.6, 5.6, 1);

        // bigger label, slightly lower
        const label = createLabelSprite(t.label, t.color);
        label.scale.set(7.2, 2.7, 1);
        label.position.y = -4.1;
        label.material.depthTest = false;

        group.add(glow, logo, label);
        orbitGroup.add(group);
        return group;
    });

    function positionNodes(time) {
        const R = 25;
        const n = nodes.length;
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + time * 0.36;
            const y = Math.sin(time * 0.9 + i) * 6;
            const x = Math.cos(a) * R;
            const z = Math.sin(a) * R;
            nodes[i].position.set(x, y, z);
        }
    }

    let t = 0;
    function animate() {
        requestAnimationFrame(animate);
        t += 0.01;

        core.rotation.x += 0.005;
        core.rotation.y += 0.007;

        orbitGroup.rotation.y += 0.004;
        orbitGroup.rotation.x = Math.sin(t * 0.55) * 0.32;
        orbitGroup.rotation.z = Math.cos(t * 0.4) * 0.22;

        root.rotation.y += 0.0015;
        root.rotation.x = Math.sin(t * 0.3) * 0.12;

        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        positionNodes(t);

        nodes
            .map(g => ({ g, z: g.position.z }))
            .sort((a, b) => a.z - b.z)
            .forEach((item, order) => {
                item.g.children.forEach(child => child.renderOrder = order);
            });

        renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
        if (!container.clientWidth || !container.clientHeight) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('aboutResize', handleResize);
}

function createLabelSprite(text, colorHex) {
    const padX = 28,
        padY = 12,
        radius = 14,
        fontSize = 28;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // measure text
    ctx.font = `bold ${fontSize}px Segoe UI, Tahoma, Arial, sans-serif`;
    const textW = ctx.measureText(text).width;
    const rawW = Math.ceil(textW + padX * 2);
    const rawH = Math.ceil(fontSize + padY * 2);

    // power-of-two for better texture sampling
    canvas.width = Math.pow(2, Math.ceil(Math.log2(Math.max(64, rawW))));
    canvas.height = Math.pow(2, Math.ceil(Math.log2(Math.max(32, rawH))));

    // redraw with proper font after resize
    ctx.font = `bold ${fontSize}px Segoe UI, Tahoma, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rw = textW + padX * 2;
    const rh = fontSize + padY * 2;

    // colors
    const r = (colorHex >> 16) & 255,
        g = (colorHex >> 8) & 255,
        b = colorHex & 255;
    const fill = `rgba(${r}, ${g}, ${b}, 0.15)`;
    const stroke = `rgba(${r}, ${g}, ${b}, 0.6)`;

    // rounded rect
    (function roundRect(ctx, x, y, w, h, rad) {
        const rr = Math.min(rad, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.lineTo(x + w - rr, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
        ctx.lineTo(x + w, y + h - rr);
        ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
        ctx.lineTo(x + rr, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
        ctx.lineTo(x, y + rr);
        ctx.quadraticCurveTo(x, y, x + rr, y);
        ctx.closePath();
    })(ctx, cx - rw / 2, cy - rh / 2, rw, rh, radius);

    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = stroke;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, cx, cy + 1);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: tex, transparent: true });
    return new THREE.Sprite(material);
}

/* Project dataset for details */
const projectData = {
    project1: {
        title: 'Wanderlust - Full-Stack Vacation Rental Platform',
        description: 'A comprehensive full-stack web application, similar to Airbnb, where users can browse, list, and book vacation rentals. The platform allows property owners to list their places and travelers to book them for their next getaway.',
        more: `Wanderlust is a robust and feature-rich clone of Airbnb, built from the ground up. It handles all major functionalities of a modern booking platform. Users can sign up and log in to their accounts. Property owners have the ability to create new listings, upload high-quality images, set prices, and manage their properties. Travelers can explore a wide range of listings, view property details, read reviews left by other users, and book their stay. The application likely includes an interactive map to show property locations and a secure review system. This project showcases a deep understanding of full-stack development, including database management, user authentication, and RESTful API design :
               <p><b>User Authentication : </b>Features secure user registration (sign-up) and login functionality.</p>
               <p><b>Property Listings : </b>Allows authenticated users to create, read, update, and delete their own property listings (CRUD operations).</p> 
               <p><b>Image Uploads : </b>Integrates with a cloud service like Cloudinary for seamless image hosting for listings.</p> 
               <p><b>Browsing & Booking : </b>Travelers can browse all available listings, view detailed property pages, and book their stay.</p> 
               <p><b>Review System : </b>Users can add and view reviews for properties, creating a community-driven and trustworthy rating system.</p> 
               <p><b>Responsive Design : </b>The platform is designed to be fully functional and user-friendly on both desktop and mobile devices.</p> 
            `,
        images: [
            'Images/Project-1-1.png',
            'Images/Project-1-2.png',
            'Images/Project-1-3.png',
            'Images/Project-1-4.png',
            'Images/Project-1-5.png',
            'Images/Project-1-6.png',
            'Images/Project-1-7.png',
            'Images/Project-1-8.png',

        ],
        tech: ['HTML5', 'JavaScript', 'Express.js', 'CSS3', 'Bootstrap', 'RESTful APIs', 'EJS', 'Node.js', 'MongoDB', 'Mongoose', 'Cloudinary', 'Render', 'Node Mailer'],
        live: 'https://wanderlust-wy3w.onrender.com/listings',
        source: 'https://github.com/kumarshobhit-1/WanderLust-Major-Project'
    },
    project2: {
        title: 'Live Weather Forecast App',
        description: 'A clean and intuitive weather application that provides real-time weather data for any city in the world using a third-party weather API.',
        more: `A practical demonstration of working with asynchronous JavaScript and integrating external APIs to deliver dynamic, real-time data.
    <p><b>-</b> Fetches real-time weather data for any city worldwide from a live weather API.</p>    
    <p><b>-</b> Allows users to search for any location to get instant weather updates.</p>
    <p><b>-</b> Displays key weather details: temperature, humidity, and wind speed.</p>
    <p><b>-</b> Shows a visual icon representing the current weather conditions (e.g., sunny, rainy, cloudy).</p>
    <p><b>-</b> Built with a user-friendly and fully responsive interface for a great experience on any device.</p>
`,
        images: [
            'Images/Project-2-1.png',
            'Images/Project-2-2.png',
            'Images/Project-2-3.png',
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript', 'Fetch API', 'Weather API', 'Netlify'],
        live: 'https://weather-app278.netlify.app/',
        source: 'https://github.com/kumarshobhit-1/weather-app'
    },
    project3: {
        title: 'Random Joke Generator',
        description: 'A fun and simple web application that fetches and displays random two-part jokes from a public API, ensuring a fresh laugh with every click.',
        more: `This project is an interactive joke teller that enhances the user experience by presenting jokes in a "setup and punchline" format.

        <p><b>-</b> Fetches random jokes from a third-party public API.</p>
        <p><b>-</b> Presents jokes in a two-part format to create suspense and enhance the delivery.</p>
        <p><b>-</b> Users first see the joke's setup and can reveal the punchline with a button click.</p>
        <p><b>-</b> Features a clean, minimalist, and fully responsive design that looks great on all devices.</p>
        <p><b>-</b> Dynamically loads content to ensure a fresh and diverse joke with every request.</p>
    `,
        images: [
            'Images/Project-3-1.png',
            'Images/Project-3-2.png',
            'Images/Project-3-3.png',
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript', 'Fetch API', 'Public Joke API', 'Netlify'],
        live: 'https://kumarshobhit-1.github.io/Random-Joke-Generator/',
        source: 'https://github.com/kumarshobhit-1/Random-Joke-Generator'
    },
    project4: {
        title: 'Interactive Simon Memory Game',
        description: 'A modern and responsive web-based version of the classic electronic memory game, Simon, to test and improve memory skills.',
        more: `A faithful recreation of the popular Simon game, designed with a clean and intuitive user interface.

        <p><b>-</b> Challenges players to memorize and repeat an ever-increasing sequence of flashing lights and corresponding sounds.</p>
        <p><b>-</b> With each successful round, the sequence gets longer and more complex, pushing your memory skills to the limit.</p>
        <p><b>-</b> Features a score tracker to monitor your progress and a dynamic difficulty that makes it engaging.</p>
        <p><b>-</b> The entire game logic is built with vanilla JavaScript, showcasing strong foundational skills.</p>
    `,
        images: [
            'Images/Project-4-1.png',
            'Images/Project-4-2.png',
            'Images/Project-4-3.png',
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript', 'Netlify'],
        live: 'https://kumarshobhit-1.github.io/Simon-Game/',
        source: 'https://github.com/kumarshobhit-1/Simon-Game'
    }
};

// Function to update project card images on page load
function updateProjectCardImages() {
    document.querySelectorAll('.project-card').forEach((card, index) => {
        const imageEl = card.querySelector('.project-image');
        if (!imageEl) return;

        const projectId = imageEl.id;
        const data = projectData[projectId];

        if (data && data.images && data.images.length > 0) {
            imageEl.style.backgroundImage = `url('${data.images[0]}')`;
            imageEl.style.backgroundSize = 'cover';
            imageEl.style.backgroundPosition = 'center';
            imageEl.style.backgroundRepeat = 'no-repeat';
        }
    });
}

function enhanceProjectCards() {
    document.querySelectorAll('.project-card').forEach(card => {
        const imageEl = card.querySelector('.project-image');
        if (!imageEl) return;
        const projectId = imageEl.id;
        const content = card.querySelector('.project-content');
        if (!content) return;

        // Prevent duplicate injection
        if (content.querySelector('.project-actions')) return;

        const actions = document.createElement('div');
        actions.className = 'project-actions';

        const btnDetails = document.createElement('button');
        btnDetails.className = 'btn btn-sm';
        btnDetails.innerHTML = '<i class="fa fa-info-circle"></i> Full Details';
        btnDetails.addEventListener('click', (e) => {
            e.stopPropagation();
            openProjectDetail(projectId);
        });

        const btnLive = document.createElement('a');
        btnLive.className = 'btn btn-secondary btn-sm';
        btnLive.innerHTML = '<i class="fa fa-globe"></i> Live Demo';
        btnLive.href = (projectData[projectId]?.live) || '#';
        btnLive.target = '_blank';
        btnLive.rel = 'noopener';
        btnLive.addEventListener('click', (e) => e.stopPropagation());

        const btnSource = document.createElement('a');
        btnSource.className = 'btn btn-outline btn-sm';
        btnSource.innerHTML = '<i class="fa fa-code"></i> Source Code';
        btnSource.href = (projectData[projectId]?.source) || '#';
        btnSource.target = '_blank';
        btnSource.rel = 'noopener';
        btnSource.addEventListener('click', (e) => e.stopPropagation());

        actions.append(btnDetails, btnLive, btnSource);
        content.appendChild(actions);

        card.addEventListener('click', () => openProjectDetail(projectId));
    });
}

/* Overlay elements */
const overlay = document.getElementById('projectOverlay');
const backBtn = document.getElementById('detailBackBtn');
const detailTitle = document.getElementById('detailTitle');
const detailDesc = document.getElementById('detailDescription');
const detailGallery = document.getElementById('detailGallery');
const detailTech = document.getElementById('detailTech');
const liveBtn = document.getElementById('detailLiveBtn');
const sourceBtn = document.getElementById('detailSourceBtn');

/* Open details modal */
function openProjectDetail(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    detailTitle.textContent = data.title;
    detailDesc.innerHTML = data.more || data.description;

    detailGallery.innerHTML = '';
    if (data.images && data.images.length > 0) {
        data.images.forEach(src => {
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = src;
            img.alt = data.title;
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                window.open(src, '_blank');
            });
            detailGallery.appendChild(img);
        });
    }
    // Tech
    detailTech.innerHTML = '';
    (data.tech || []).forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = t;
        detailTech.appendChild(tag);
    });

    // Actions
    liveBtn.href = data.live || '#';
    sourceBtn.href = data.source || '#';
    // Add icons to buttons
    liveBtn.innerHTML = '<i class="fa fa-globe"></i> Live Demo';
    sourceBtn.innerHTML = '<i class="fa fa-code"></i> Source Code';

    // Show overlay
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    // Lock body scroll
    document.body.dataset.scrollY = String(window.scrollY || 0);
    document.body.style.overflow = 'hidden';
}

/* Close details modal */
function closeProjectDetail() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const y = parseInt(document.body.dataset.scrollY || '0', 10);
    if (!isNaN(y)) window.scrollTo(0, y);
}

/* Wire overlay closing */
backBtn.addEventListener('click', closeProjectDetail);
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeProjectDetail();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeProjectDetail();
});

/* Init */
enhanceProjectCards();
setupProjectShowHide();

function setupProjectShowHide() {
    const grid = document.getElementById('projectsGrid');
    const btnMore = document.getElementById('viewMoreProjectsBtn');
    const btnLess = document.getElementById('viewLessProjectsBtn');
    if (!grid || !btnMore || !btnLess) return;
    const cards = grid.querySelectorAll('.project-card');

    function showFirstThree() {
        cards.forEach((card, i) => {
            card.style.display = i < 3 ? '' : 'none';
        });
        btnMore.style.display = cards.length > 3 ? 'inline-block' : 'none';
        btnLess.style.display = 'none';
    }

    function showAll() {
        cards.forEach(card => card.style.display = '');
        btnMore.style.display = 'none';
        btnLess.style.display = 'inline-block';
    }

    showFirstThree();

    btnMore.addEventListener('click', showAll);
    btnLess.addEventListener('click', showFirstThree);
}

// Add this line to update images on load
enhanceProjectCards();
setupProjectShowHide();

function setupBlogShowHide() {
    const grid = document.getElementById('blogGrid');
    const btnMore = document.getElementById('viewMoreBlogBtn');
    const btnLess = document.getElementById('viewLessBlogBtn');
    if (!grid || !btnMore || !btnLess) return;
    const cards = grid.querySelectorAll('.project-card');

    function showFirstThree() {
        cards.forEach((card, i) => {
            card.style.display = i < 3 ? '' : 'none';
        });
        btnMore.style.display = cards.length > 3 ? 'inline-block' : 'none';
        btnLess.style.display = 'none';
    }

    function showAll() {
        cards.forEach(card => card.style.display = '');
        btnMore.style.display = 'none';
        btnLess.style.display = 'inline-block';
    }

    showFirstThree();

    btnMore.addEventListener('click', showAll);
    btnLess.addEventListener('click', showFirstThree);
}

setupBlogShowHide();

updateProjectCardImages();
enhanceProjectCards();
setupProjectShowHide();


function initTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    const texts = [
        'Full-Stack Developer',
        'MERN Stack Developer',
        'Blockchain Enthusiast',
        'Web3 Enthusiast',
        'React Developer',
        'Node.js Developer'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing animation after page load
    setTimeout(type, 1000);
}


window.addEventListener('load', () => {
    setTimeout(initTypingAnimation, 2000);
});


function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });

        // Add hover effect
        scrollIndicator.addEventListener('mouseenter', () => {
            scrollIndicator.style.transform = 'translateX(-50%) scale(1.1)';
        });

        scrollIndicator.addEventListener('mouseleave', () => {
            scrollIndicator.style.transform = 'translateX(-50%) scale(1)';
        });
    }
}

// Initialize scroll indicator after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        initScrollIndicator();
        initTypingAnimation();
    }, 2000);
});


// AI Chatbot Functionality
(function () {
    const aiIcon = document.getElementById('aiIcon');
    const aiModal = document.getElementById('aiModal');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    const voiceBtn = document.createElement('button');
    voiceBtn.innerHTML = '<i class="fa fa-microphone"></i>';
    voiceBtn.className = 'btn btn-secondary btn-sm voice-input-btn';
    voiceBtn.title = 'Voice Input';

    const clearBtn = document.createElement('button');
    clearBtn.innerHTML = '<i class="fa fa-trash"></i>';
    clearBtn.className = 'btn btn-outline btn-sm';
    clearBtn.title = 'Clear Chat';

    const exportBtn = document.createElement('button');
    exportBtn.innerHTML = '<i class="fa fa-download"></i>';
    exportBtn.className = 'btn btn-secondary btn-sm';
    exportBtn.title = 'Export Chat';

    const searchBtn = document.createElement('button');
    searchBtn.innerHTML = '<i class="fa fa-search"></i>';
    searchBtn.className = 'btn btn-secondary btn-sm';
    searchBtn.title = 'Search Messages';

    const modalHeader = document.querySelector('.ai-modal-header');
    modalHeader.appendChild(searchBtn);
    modalHeader.appendChild(exportBtn);
    modalHeader.appendChild(clearBtn);

    // Add voice button to input area
    const chatInputContainer = document.querySelector('.ai-chat-input');
    chatInputContainer.appendChild(voiceBtn);

    // Enhanced responses with more intelligence
    const responses = {
        greeting: [
            "👋 Hello! I'm Shobhit's AI assistant. I can help you learn about his skills, projects, experience, and how to get in touch. What would you like to know?",
            "🤖 Hi there! Welcome! I'm here to tell you all about Shobhit Kumar. What interests you most - his projects, skills, or experience?",
            "✨ Greetings! I'm Shobhit's virtual assistant. Feel free to ask me anything about his work, background, or how to connect with him!"
        ],
        about: "📖 About Shobhit Kumar -: \n\n🎓 Education : B.Tech student passionate about technology\n💻 Expertise : MERN Stack Developer with hands-on experience\n🔗 Passion : Blockchain & Web3 technologies\n🚀 Vision : Building innovative decentralized solutions\n\n Current Focus :\n• Full-stack web applications\n• Smart contract development\n• DApp creation\n• Web3 integration\n\n Want to know about specific areas of expertise?",
        projects: "🚀 Featured Projects Portfolio -: \n\n Wanderlust -\n• Wanderlust is a robust and feature-rich clone of Airbnb, built from the ground up \n• It handles all major functionalities of a modern booking platform \n• Users can sign up and log in to their accounts \n• Property owners can create new listings, upload images, set prices, and manage their properties \n• Travelers can explore listings, view details, read reviews, and book their stay \n\nLive Weather Forecast App :- \n• Fetches real-time weather data for any city worldwide from a live weather API\n• Allows users to search for any location to get instant weather updates\n• Displays key weather details: temperature, humidity, and wind speed\n• Shows a visual icon representing the current weather conditions (e.g., sunny, rainy, cloudy)\n\n🎮 Simon Memory Game -: \n• A faithful recreation of the popular Simon game, designed with a clean and intuitive user interface.\n• The entire game logic is built with vanilla JavaScript, showcasing strong foundational skills\n• Cross-platform compatibility\n\n Random Joke Generator -: \n• Fetches random jokes from a public API\n• Presents jokes in a two-part format to create suspense and enhance the delivery\n• Users first see the joke's setup and can reveal the punchline with a button click\n• Features a clean, minimalist, and fully responsive design that looks great on all devices\n• Dynamically loads content to ensure a fresh and diverse joke with every request\n\n\n Click on any project card to see detailed information!",
        skills: "🛠️ Technical Stack & Expertise -: \n\n🎨 Frontend Development \n• React.js, Next.js, Vue.js, Vite.js\n• HTML5, CSS3, Bootstrap, TailwindCSS\n• Responsive design\n• Three.js for 3D graphics\n\n⚡ Backend Development\n• Node.js, Express.js\n• MongoDB, MySQL, SQL\n• RESTful APIs\n• Microservices architecture\n\n🔧 DevOps & Tools\n• Git\n• Testing frameworks\n• Performance optimization\n\n*Each skill is backed by real-world projects!*",
        contact: "📧 Let's Connect & Collaborate! -: \n\n💼 Professional Channels : \n• Website : Use the contact form below\n• LinkedIn : Professional networking\n• GitHub : Open source contributions\n• Email: Direct communication\n\n🎯 Best For : \n• Project collaborations\n• Job opportunities\n• Technical discussions\n• Mentorship requests\n\n⚡ Quick Response:**\n• Form submissions: Within 24 hours\n• LinkedIn messages: Same day\n• GitHub issues: Within 48 hours\n\n💡 Pro Tips -: \n• Mention specific project interests\n• Include your preferred communication method\n• Share your project timeline\n\n*Ready to build something amazing together?*",
        default: "🤔 I didn't quite understand that, but I'm here to help! Here's what I can assist you with :\n\n🎯 Popular Questions : \n• \"Tell me about Shobhit's experience\"\n• \"What projects has he worked on?\"\n• \"How can I contact him?\"\n• \"What are his technical skills?\"\n• \"Does he work with blockchain?\"\n\n💡 Try asking : \n• About specific technologies\n• Project collaboration ideas\n• His learning journey\n\n*I'm constantly learning, so feel free to rephrase your question!*"
    };

    // Conversation context and memory
    let conversationContext = {
        askedAbout: [],
        interests: [],
        previousQuestions: [],
        conversationFlow: 'initial'
    };

    // Enhanced project details with more comprehensive information

    const projectDetails = {
        "wanderlust": {
            title: '🏨 Wanderlust - Vacation Rental Platform',
            description: `A comprehensive platform inspired by Airbnb, built from the ground up.
            • User Authentication: Secure sign-up and login system using Passport.js.
            • CRUD Functionality: Users can create, read, update, and delete their own property listings.
            • Image Uploads: Seamlessly uploads property images to the cloud using Cloudinary.
            • Interactive Maps: Integrates Mapbox to display property locations.
            • Review System: Allows users to post and view reviews for different properties.`,
            tech: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'Bootstrap', 'Passport.js', 'Cloudinary', 'Mapbox'],
            live: 'https://wanderlust-wy3w.onrender.com/listings',
            source: 'https://github.com/kumarshobhit-1/WanderLust-Major-Project',
            category: "Full-Stack, Web Application",
            status: "Production Ready",
            complexity: "Advanced"
        },
        "weather app": {
            title: '☁️ Live Weather Forecast App',
            description: `A practical demonstration of working with asynchronous JavaScript to deliver dynamic, real-time data.
            • Fetches live weather data for any city worldwide from a weather API.
            • Allows users to search for a location to get instant updates.
            • Displays key details: temperature, humidity, and wind speed.
            • Shows a visual icon representing the current weather conditions.`,
            tech: ['JavaScript (ES6)', 'HTML5', 'CSS3', 'Fetch API', 'Weather API', 'Netlify'],
            live: 'https://weather-app278.netlify.app/',
            source: 'https://github.com/kumarshobhit-1/weather-app',
            category: "Frontend, API Integration",
            status: "Completed",
            complexity: "Intermediate"
        },
        "random joke generator": {
            title: '😂 Random Joke Generator',
            description: `An interactive joke teller that enhances user experience by presenting jokes in a "setup and punchline" format.
            • Fetches random jokes from a third-party public API.
            • Presents jokes in two parts to create suspense and improve delivery.
            • Users click a button to reveal the punchline after reading the setup.
            • Features a clean, minimalist, and fully responsive design.`,
            tech: ['JavaScript', 'HTML5', 'CSS3', 'Public Joke API', 'Netlify'],
            live: 'https://random-joke-setup.netlify.app/',
            source: 'https://github.com/kumarshobhit-1/Random-Joke-Generator',
            category: "Frontend, API",
            status: "Completed",
            complexity: "Beginner"
        },
        "simon game": {
            title: '🧠 Simon Memory Game',
            description: `A faithful recreation of the popular Simon game, designed with a clean and intuitive user interface.
            • Challenges players to memorize and repeat an ever-increasing sequence of lights and sounds.
            • The sequence becomes longer and more complex with each successful round.
            • Includes a score tracker to monitor the user's progress.
            • The entire game logic is built with vanilla JavaScript.`,
            tech: ['JavaScript', 'HTML5', 'CSS3', 'Netlify'],
            live: 'https://simon-game25.netlify.app/',
            source: 'https://github.com/kumarshobhit-1/Simon-Game',
            category: "Frontend, Game Development",
            status: "Completed",
            complexity: "Intermediate"
        }
    };

    // Variables
    let isListening = false;
    let recognition = null;
    let messageCount = 0;
    let searchMode = false;
    let conversationHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');

    // Enhanced helper functions
    function getRandomResponse(responseArray) {
        if (Array.isArray(responseArray)) {
            return responseArray[Math.floor(Math.random() * responseArray.length)];
        }
        return responseArray;
    }

    function updateConversationContext(userMessage, response) {
        conversationContext.previousQuestions.push(userMessage);

        // Track interests based on user queries
        if (userMessage.includes('project')) conversationContext.interests.push('projects');
        if (userMessage.includes('skill') || userMessage.includes('tech')) conversationContext.interests.push('skills');
        if (userMessage.includes('blockchain') || userMessage.includes('web3')) conversationContext.interests.push('blockchain');
        if (userMessage.includes('contact')) conversationContext.interests.push('contact');

        // Update conversation flow
        if (conversationContext.previousQuestions.length > 3) {
            conversationContext.conversationFlow = 'engaged';
        }
    }


    // Add once: styles for chatbot link buttons
    function injectChatLinkButtonStyles() {
        if (document.getElementById('chat-link-btn-styles')) return;
        const style = document.createElement('style');
        style.id = 'chat-link-btn-styles';
        style.textContent = `
            /* Chat link buttons styling */
            #aiModal .message-content .chat-link-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                margin: 6px 8px 0 0;
                border-radius: 8px;
                border: 1.5px solid rgba(255,255,255,0.25);
                background: linear-gradient(135deg, rgba(0,255,204,0.15), rgba(0,153,255,0.12));
                color: #fff;
                font-weight: 600;
                font-size: 13px;
                cursor: pointer;
                text-decoration: none;
                transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
            }
            #aiModal .message-content .chat-link-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 14px rgba(0,0,0,0.25), 0 0 0 2px rgba(0,255,204,0.25) inset;
                border-color: rgba(0,255,204,0.55);
                background: linear-gradient(135deg, rgba(0,255,204,0.25), rgba(0,153,255,0.18));
            }
            #aiModal .message-content .chat-link-btn:active {
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2) inset;
            }
            #aiModal .message-content .chat-link-btn:focus-visible {
                outline: none;
                box-shadow: 0 0 0 3px rgba(0,255,204,0.45);
            }
            /* Variants */
            #aiModal .message-content .chat-link-btn.live {
                border-color: rgba(0,255,204,0.45);
            }
            #aiModal .message-content .chat-link-btn.source {
                border-color: rgba(100,181,246,0.55);
                background: linear-gradient(135deg, rgba(100,181,246,0.18), rgba(33,150,243,0.12));
            }
            #aiModal .message-content .chat-link-btn.link {
                border-color: rgba(180,180,180,0.4);
            }
            #aiModal .message-content .chat-link-btn .fa {
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    // Add: safely convert markdown links and raw URLs to clickable anchors
    function processMessageContent(content) {
        if (!content) return '';
        let safe = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (m, text, url) => {
            try {
                const u = new URL(url);
                if (u.protocol !== 'http:' && u.protocol !== 'https:') return m;
            } catch {
                return m;
            }
            const lt = text.toLowerCase();
            const variant = lt.includes('live') ? 'live' : (lt.includes('source') || lt.includes('code')) ? 'source' : 'link';
            const icon = lt.includes('live') ? 'globe' : (lt.includes('source') || lt.includes('code')) ? 'code' : 'link';
            return `<button class="chat-link-btn ${variant}" type="button" title="${text}" onclick="window.open('${url}','_blank')"><i class="fa fa-${icon}"></i><span>${text}</span></button>`;
        });

        safe = safe.replace(/(^|[\s(])((https?:\/\/[^\s<)]+))/g, (m, pre, url) => {
            return `${pre}<button class="chat-link-btn link" type="button" title="${url}" onclick="window.open('${url}','_blank')"><i class="fa fa-link"></i><span>${url}</span></button>`;
        });

        safe = safe.replace(/\n/g, '<br>');

        return safe;
    }

    injectChatLinkButtonStyles();

    function addMessage(content, isUser = false, showAvatar = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageId = `msg-${Date.now()}-${messageCount++}`;

        let avatarHtml = '';
        if (showAvatar) {
            avatarHtml = `<div class="message-avatar">${isUser ? '👤' : '🤖'}</div>`;
        }

        const processedContent = processMessageContent(content);

        messageDiv.innerHTML = `
            ${avatarHtml}
            <div class="message-bubble">
                <div class="message-content" data-message-id="${messageId}">${processedContent}</div>
                <div class="message-actions">
                    <span class="message-time">${timestamp}</span>
                    ${!isUser ? `
                        <button class="copy-message-btn" data-message-id="${messageId}" title="Copy message">
                            <i class="fa fa-copy"></i>
                        </button>
                        <button class="reaction-btn" data-message-id="${messageId}" data-reaction="like" title="Helpful">
                            <i class="fa fa-thumbs-up"></i>
                        </button>
                        <button class="reaction-btn" data-message-id="${messageId}" data-reaction="dislike" title="Not helpful">
                            <i class="fa fa-thumbs-down"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (!isUser) {
            const copyBtn = messageDiv.querySelector('.copy-message-btn');
            copyBtn?.addEventListener('click', () => copyMessage(messageId));

            const reactionBtns = messageDiv.querySelectorAll('.reaction-btn');
            reactionBtns.forEach(btn => {
                btn.addEventListener('click', () => handleReaction(messageId, btn.dataset.reaction));
            });
        }

        conversationHistory.push({
            id: messageId,
            content: content,
            isUser: isUser,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('chatHistory', JSON.stringify(conversationHistory.slice(-100)));

        return messageDiv;
    }

    function handleReaction(messageId, reaction) {
        const btn = document.querySelector(`[data-message-id="${messageId}"][data-reaction="${reaction}"]`);
        if (btn) {
            btn.style.color = reaction === 'like' ? '#00ffcc' : '#ff6b6b';
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);

            showNotification(reaction === 'like' ? 'Thanks for the feedback! 👍' : 'I\'ll try to improve! 👎');
        }
    }

    function copyMessage(messageId) {
        const messageEl = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageEl) {
            const text = messageEl.textContent || messageEl.innerText;
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Message copied to clipboard! 📋');
            });
        }
    }

    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = 'chat-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isError ? '#ff4444' : '#00ffcc'};
            color: ${isError ? '#fff' : '#000'};
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 3000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">
            <div class="message-content">
                <div class="typing-animation">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span class="typing-text">Thinking...</span>
                </div>
            </div>
        </div>
    `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    function showSmartSuggestions() {
        const existingSuggestions = chatMessages.querySelectorAll('.suggestions');
        existingSuggestions.forEach(s => s.remove());

        let suggestions = [
            { query: "Tell me about your skills", icon: "💡", text: "Skills & Expertise" },
            { query: "Show me your projects", icon: "🚀", text: "Featured Projects" },
            { query: "How can I contact you?", icon: "📧", text: "Get In Touch" }
        ];

        if (!conversationContext.askedAbout.includes('blockchain')) {
            suggestions.push({ query: "What's your blockchain experience?", icon: "🔗", text: "Blockchain & Web3" });
        }

        if (!conversationContext.askedAbout.includes('experience')) {
            suggestions.push({ query: "What's your professional experience?", icon: "💼", text: "Experience" });
        }

        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggestions';
        suggestionsDiv.innerHTML = `
            <div class="suggestion-buttons">
                ${suggestions.map(s =>
            `<button class="suggestion-btn" data-query="${s.query}">${s.icon} ${s.text}</button>`
        ).join('')}
            </div>
        `;
        chatMessages.appendChild(suggestionsDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        suggestionsDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                chatInput.value = query;
                handleSendMessage();
            });
        });
    }

    function getIntelligentResponse(userMessage) {
        const msg = userMessage.toLowerCase().trim();
        updateConversationContext(userMessage, '');

        if (msg.includes('good morning') || msg.includes('morning')) {
            return "👋 Good Morning! How can I assist you with Shobhit's portfolio today?";
        }
        else if (msg.includes('good evening') || msg.includes('evening')) {
            return "👋 Good Evening! What would you like to know about Shobhit's work?";
        }
        else if (msg.includes('good night') || msg.includes('night')) {
            return "Good Night! Feel free to reach out tomorrow if you have more questions.";
        }

        else if (msg.includes('namaste')) {
            return "Namaste! 🙏 How may I help you today?";
        }
        else if (msg.includes('as-salamu alaykum') || msg.includes('salam')) {
            return "Wa alaykumu s-salam! How can I assist you? What else can I help you find in Shobhit's portfolio?";
        }
        else if (msg.includes('sat sri akal') || msg.includes('sat sri akal ji') || msg.includes('sat sri akal jee') || msg.includes('sat shri Akaal')) {
            return "Sat Sri Akal Ji! How can I help you today?, What else can I help you find in Shobhit's work?";
        }

        else if (['hello', 'hi', 'hii', 'hey', 'hye', 'hyy', 'hay'].some(word => msg.includes(word))) {
            if (conversationContext.conversationFlow === 'engaged') {
                return "👋 Welcome ! What else can I help you find in Shobhit's portfolio?";
            }
            return getRandomResponse(responses.greeting);
        }

        if (msg.includes('project') || msg.includes('work') || msg.includes('portfolio')) {
            conversationContext.askedAbout.push('projects');
            return responses.projects;
        }

        // Enhanced skills queries
        if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack') || msg.includes('expertise')) {
            conversationContext.askedAbout.push('skills');
            return responses.skills;
        }

        // About queries
        if (msg.includes('about') || msg.includes('who') || msg.includes('background')) {
            conversationContext.askedAbout.push('about');
            return responses.about;
        }

        // Contact queries
        if (msg.includes('contact') || msg.includes('reach') || msg.includes('hire') || msg.includes('collaborate')) {
            conversationContext.askedAbout.push('contact');
            return responses.contact;
        }

        // Blockchain specific
        if (msg.includes('blockchain') || msg.includes('web3') || msg.includes('crypto') || msg.includes('smart contract')) {
            conversationContext.askedAbout.push('blockchain');
            return "🔗 Blockchain & Web3 Journey -: \n\n🌟 Current Focus : Building the decentralized future\n🛠️ Technologies : Solidity, Web3.js, Ethers.js\n⚡ Networks: Ethereum, Polygon, BSC\n🎯 Specialties : DeFi protocols, NFT marketplaces, DAOs\n\nLearning Path : \n• Started with Bitcoin fundamentals\n• Mastered Ethereum development\n• Exploring Layer 2 solutions\n• Researching zero-knowledge proofs\n\n*Want to collaborate on a Web3 project?*";
        }

        for (const key in projectDetails) {
            const searchTerm = key.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
            if (msg.includes(searchTerm)) {
                const proj = projectDetails[key];
                return `${proj.description}\n\n🛠️ Tech Stack : ${proj.tech}\n📊 Category : ${proj.category}\n🎯 Status : ${proj.status}\n⭐ Complexity : ${proj.complexity}\n\n🔗 Links :\n• [Live Demo](${proj.live})\n• [Source Code](${proj.source})`;
            }
        }

        if (msg.includes('experience') || msg.includes('journey') || msg.includes('career')) {
            return "💼 My Development Journey -: \n\n🎓 Academic Foundation \n• B.Tech Computer Science (Ongoing)\n• Learn algorithms and data structures\n• Active in coding competitions and hackathons\n\n💻 Technical Evolution\n• 2022 : Started with HTML, CSS, JavaScript basics\n• 2023-2024 : Learned React and Node.js ecosystem and Backend Development\n• Present : Building full-stack and decentralized applications\n\n🏆 Key Milestones -: \n• 5+ completed projects across different domains\n• Contributed to open-source repositories\n• Built production-ready applications\n• Exploring AI integration in web development\n\n 🎯 Current Goal -: \n• Master smart contract security\n• Build scalable DeFi protocols\n• Contribute to major blockchain projects\n\n*Every project teaches me something new!*";
        }

        if (msg.includes('thank you') || msg.includes('thanks') || msg.includes('thanks')) {
            return "🙏 You're very welcome! I'm here to help you learn more about Shobhit. Is there anything specific you'd like to know more about?";
        }

        if (msg.includes('bye') || msg.includes('goodbye')) {
            return "👋 Thanks for the great conversation! Feel free to come back anytime. Don't forget to check out the projects and get in touch if you'd like to collaborate!";
        }

        return responses.default;
    }

    function searchMessages() {
        if (!searchMode) {
            chatInput.placeholder = 'Search messages...';
            chatInput.focus();
            searchMode = true;
            searchBtn.innerHTML = '<i class="fa fa-times"></i>';
            searchBtn.title = 'Cancel Search';
        } else {
            chatInput.placeholder = 'Type your question here...';
            searchMode = false;
            searchBtn.innerHTML = '<i class="fa fa-search"></i>';
            searchBtn.title = 'Search Messages';
            highlightSearchResults('');
        }
    }

    function highlightSearchResults(query) {
        const messages = chatMessages.querySelectorAll('.message-content');
        messages.forEach(msg => {
            if (query && msg.textContent.toLowerCase().includes(query.toLowerCase())) {
                msg.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
                msg.style.border = '1px solid rgba(255, 255, 0, 0.5)';
            } else {
                msg.style.backgroundColor = '';
                msg.style.border = '';
            }
        });
    }

    function exportChat() {
        const messages = conversationHistory.map(msg => {
            const time = new Date(msg.timestamp).toLocaleString();
            const sender = msg.isUser ? 'You' : 'AI Assistant';
            return `[${time}] ${sender}: ${msg.content}`;
        }).join('\n\n');

        const blob = new Blob([messages], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shobhit-ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification('Chat exported successfully! 📄');
    }

    function handleSendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        if (searchMode) {
            highlightSearchResults(userMessage);
            chatInput.value = '';
            return;
        }

        chatInput.disabled = true;
        sendBtn.disabled = true;
        voiceBtn.disabled = true;

        addMessage(userMessage, true);
        chatInput.value = '';

        const typingIndicator = showTypingIndicator();

        const responseTime = Math.min(Math.max(userMessage.length * 50, 1500), 3000);

        setTimeout(() => {
            typingIndicator.remove();
            const botResponse = getIntelligentResponse(userMessage);
            addMessage(botResponse);

            chatInput.disabled = false;
            sendBtn.disabled = false;
            voiceBtn.disabled = false;
            chatInput.focus();

            setTimeout(showSmartSuggestions, 500);
        }, responseTime);
    }

    function setupVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            voiceBtn.style.display = 'none';
            return;
        }

        voiceBtn.addEventListener('click', () => {
            if (isListening) {
                if (recognition) recognition.stop();
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                isListening = true;
                voiceBtn.innerHTML = '<i class="fa fa-stop-circle"></i>';
                voiceBtn.style.backgroundColor = '#ff4444';
                chatInput.placeholder = '🎤 Listening... Speak now!';
                showNotification('🎤 Voice recording started. Speak clearly!');
            };

            recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                chatInput.value = finalTranscript + interimTranscript;

                if (finalTranscript) {
                    setTimeout(handleSendMessage, 500);
                }
            };

            recognition.onerror = () => {
                addMessage("❌ Sorry, I couldn't understand you clearly. Please try again or type your message.", false);
                resetVoiceButton();
                showNotification('Voice recognition failed. Please try again!', true);
            };

            recognition.onend = resetVoiceButton;

            try {
                recognition.start();
            } catch (error) {
                resetVoiceButton();
                showNotification('Voice recognition unavailable', true);
            }
        });
    }

    function resetVoiceButton() {
        isListening = false;
        voiceBtn.innerHTML = '<i class="fa fa-microphone"></i>';
        voiceBtn.style.backgroundColor = '';
        chatInput.placeholder = 'Type your question here...';
    }

    function clearChat() {
        chatMessages.innerHTML = '';
        conversationHistory = [];
        conversationContext = { askedAbout: [], interests: [], previousQuestions: [], conversationFlow: 'initial' };
        localStorage.removeItem('chatHistory');

        addMessage("Chat cleared! 🧹\n\nHello! I'm Shobhit's enhanced AI assistant with new features like search, export, and intelligent responses. How can I help you today?", false);
        showSmartSuggestions();
        showNotification('Chat history cleared! 🧹');
    }

    // Event listeners
    aiIcon.addEventListener('click', () => {
        aiModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (chatMessages.children.length === 0) {
            addMessage("Hello! I'm Shobhit's enhanced AI assistant! 🤖\n\nI now have improved intelligence, message reactions, search functionality, and chat export features. What would you like to know?", false);
            showSmartSuggestions();
        }

        setTimeout(() => chatInput.focus(), 300);
    });

    function closeModal() {
        aiModal.classList.remove('active');
        document.body.style.overflow = '';
        resetVoiceButton();
        if (searchMode) searchMessages();
    }

    [clearBtn, exportBtn, searchBtn].forEach(btn => {
        btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid rgba(255, 255, 255, 0.5)';
        btn.style.fontWeight = '600';
        btn.style.marginLeft = '5px';

        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            btn.style.transform = 'translateY(-1px)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            btn.style.transform = 'translateY(0)';
        });
    });

    // Event bindings
    aiCloseBtn.addEventListener('click', closeModal);
    aiModal.addEventListener('click', (e) => {
        if (e.target === aiModal) closeModal();
    });

    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (searchMode) {
                highlightSearchResults(chatInput.value);
                chatInput.value = '';
            } else {
                handleSendMessage();
            }
        }
    });

    clearBtn.addEventListener('click', clearChat);
    exportBtn.addEventListener('click', exportChat);
    searchBtn.addEventListener('click', searchMessages);

    setupVoiceRecognition();
})();
