document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Menu Mobile e Scroll Suave ---
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });

  // Scroll suave com compensação do header fixo (header + footer links internos)
  const header = document.getElementById("header");

  function smoothScrollToHash(hash, shouldUpdateHistory = true) {
    if (!hash || hash === "#") return;
    const targetElement = document.querySelector(hash);
    if (!targetElement) return;

    const headerOffset = header ? header.offsetHeight + 10 : 0;
    const targetPosition =
      targetElement.getBoundingClientRect().top +
      window.pageYOffset -
      headerOffset;

    window.scrollTo({
      top: Math.max(targetPosition, 0),
      behavior: "smooth",
    });

    if (shouldUpdateHistory) {
      history.pushState(null, "", hash);
    }
  }

  document.addEventListener("click", (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;
    if (!document.querySelector(targetId)) return;

    e.preventDefault();
    smoothScrollToHash(targetId, true);

    // Fecha o menu mobile se estiver aberto
    if (nav.classList.contains("nav-active")) {
      nav.classList.remove("nav-active");
      burger.classList.remove("toggle");
    }
  });

  // Ajusta o posicionamento ao abrir com hash na URL
  if (window.location.hash) {
    setTimeout(() => smoothScrollToHash(window.location.hash, false), 80);
  }

  // --- 2. Guia Prático (Abas) ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const filterResult = document.getElementById("filter-result");

  const disposalSteps = {
    smartphone: `
            <h4>Smartphones e Tablets</h4>
            <ul>
                <li><strong>Backup:</strong> Salve seus arquivos na nuvem.</li>
                <li><strong>Limpeza:</strong> Restaure os padrões de fábrica.</li>
                <li><strong>Chips:</strong> Remova SIM cards e SD cards.</li>
                <li><strong>Descarte:</strong> Leve a coletores de eletrônicos.</li>
            </ul>
        `,
    notebook: `
            <h4>Notebooks e PCs</h4>
            <ul>
                <li><strong>HD/SSD:</strong> Apague seus dados ou remova o disco.</li>
                <li><strong>Periféricos:</strong> Separe mouses e teclados.</li>
                <li><strong>Bateria:</strong> Verifique se há danos externos.</li>
                <li><strong>Doação:</strong> Considere doar se estiver funcional.</li>
            </ul>
        `,
    pilhas: `
            <h4>Pilhas e Baterias</h4>
            <ul>
                <li><strong>Armazenamento:</strong> Use um pote seco e resistente.</li>
                <li><strong>Terminais:</strong> Isole os polos com fita crepe.</li>
                <li><strong>Atenção:</strong> Nunca jogue no lixo comum.</li>
                <li><strong>Pontos:</strong> Farmácias e mercados possuem coletores.</li>
            </ul>
        `,
    eletro: `
            <h4>Eletrodomésticos</h4>
            <ul>
                <li><strong>Preparação:</strong> Limpe resíduos internos.</li>
                <li><strong>Cabos:</strong> Mantenha os fios organizados.</li>
                <li><strong>Volume:</strong> Verifique o serviço de cata-treco local.</li>
                <li><strong>Marca:</strong> Consulte o programa de reciclagem da marca.</li>
            </ul>
        `,
  };

  function switchTab(device) {
    tabBtns.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.device === device),
    );
    filterResult.style.opacity = 0;
    setTimeout(() => {
      filterResult.innerHTML = disposalSteps[device];
      filterResult.style.opacity = 1;
    }, 150);
  }

  tabBtns.forEach((btn) =>
    btn.addEventListener("click", () => switchTab(btn.dataset.device)),
  );
  switchTab("smartphone");

  // --- 3. Intersection Observer (Animações) ---
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    },
    { threshold: 0.1 },
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // --- 4. Contador Animado (Stats) ---
  const stats = document.querySelectorAll(".stat-number");
  const statsSection = document.getElementById("stats");
  let counted = false;

  const countUp = () => {
    stats.forEach((stat) => {
      const target = parseFloat(stat.getAttribute("data-target"));
      const duration = 2000;
      const startTime = performance.now();
      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = progress * (2 - progress);
        const currentNum = easedProgress * target;
        stat.innerText = currentNum.toFixed(target % 1 === 0 ? 0 : 1);
        if (progress < 1) requestAnimationFrame(updateCount);
        else stat.innerText = target;
      };
      requestAnimationFrame(updateCount);
    });
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !counted) {
        countUp();
        counted = true;
      }
    },
    { threshold: 0.5 },
  );
  statsObserver.observe(statsSection);

  // --- 5. Formulário (Web3Forms) ---
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const ebookSection = document.getElementById("ebook-download");
  const ebookLockMsg = document.getElementById("ebook-download-lock-msg");
  const downloadModal = document.getElementById("download-modal");
  const modalDownloadYes = document.getElementById("modal-download-yes");
  const modalDownloadNo = document.getElementById("modal-download-no");
  const EBOOK_SECTION_UNLOCK_STORAGE_KEY = "ebookSectionUnlocked";

  function showEbookSection() {
    if (!ebookSection) return;
    ebookSection.classList.remove("d-none");
    if (ebookLockMsg) {
      ebookLockMsg.textContent =
        "Download liberado pelo seu feedback. Obrigado por contribuir com o projeto!";
    }
    try {
      localStorage.setItem(EBOOK_SECTION_UNLOCK_STORAGE_KEY, "true");
    } catch (e) {
      // Ignora falhas de storage no modo privado/restrito.
    }
  }

  function hideEbookSection() {
    if (!ebookSection) return;
    ebookSection.classList.add("d-none");
  }

  function openDownloadModal() {
    if (!downloadModal) return;
    downloadModal.classList.remove("d-none");
  }

  function closeDownloadModal() {
    if (!downloadModal) return;
    downloadModal.classList.add("d-none");
  }

  function initializeEbookSectionVisibility() {
    try {
      const isUnlocked =
        localStorage.getItem(EBOOK_SECTION_UNLOCK_STORAGE_KEY) === "true";
      if (isUnlocked) {
        showEbookSection();
        return;
      }
    } catch (e) {
      // Em caso de erro no storage, mantém oculto por padrão.
    }
    hideEbookSection();
  }

  initializeEbookSectionVisibility();

  if (modalDownloadYes) {
    modalDownloadYes.addEventListener("click", () => {
      closeDownloadModal();
      smoothScrollToHash("#ebook-download", true);
    });
  }

  if (modalDownloadNo) {
    modalDownloadNo.addEventListener("click", closeDownloadModal);
  }

  if (downloadModal) {
    downloadModal.addEventListener("click", (event) => {
      if (event.target === downloadModal) closeDownloadModal();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDownloadModal();
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      formStatus.innerHTML = "Enviando...";
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: json,
        });
        if (response.status === 200) {
          formStatus.style.color = "var(--primary-green)";
          formStatus.innerHTML =
            "Feedback enviado com sucesso! A seção de download foi liberada.";
          showEbookSection();
          openDownloadModal();
          form.reset();
        } else {
          formStatus.style.color = "red";
          formStatus.innerHTML = "Erro ao enviar.";
        }
      } catch (error) {
        formStatus.innerHTML = "Algo deu errado.";
      }
    });
  }

  // --- 7. Mapa de Coleta (Leaflet + Nominatim - Foco Ecopontos) ---
  let map;
  let markers = [];
  let userMarker;
  const mapLoader = document.getElementById("map-loader");
  const listaPontos = document.getElementById("lista-pontos");
  const addressInput = document.getElementById("address-input");
  const isFileProtocol = window.location.protocol === "file:";
  const SEARCH_RADIUS_KM = 30;
  const SEARCH_RADIUS_M = SEARCH_RADIUS_KM * 1000;
  let currentSearchOrigin = null;

  function initMap() {
    if (map) return;
    map = L.map("map").setView([-15.7801, -47.9292], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
  }

  initMap();

  function addLocalModeNotice() {
    if (!isFileProtocol) return;
    const mapSection = document.querySelector("#mapa-coleta .container");
    if (!mapSection || mapSection.querySelector(".local-mode-note")) return;

    const note = document.createElement("p");
    note.className = "local-mode-note text-center";
    note.innerHTML =
      "Modo local detectado (`file://`). Se a busca falhar no seu navegador, abra este site em <strong>http://localhost</strong> para evitar bloqueios de segurança.";
    mapSection.appendChild(note);
  }

  function fetchNominatimJsonp(url) {
    return new Promise((resolve, reject) => {
      const callbackName = `nominatimCb_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const script = document.createElement("script");

      const cleanup = () => {
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      };

      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error("Falha ao consultar Nominatim via JSONP."));
      };

      const separator = url.includes("?") ? "&" : "?";
      script.src = `${url}${separator}json_callback=${callbackName}`;
      document.head.appendChild(script);
    });
  }

  // Função robusta para Nominatim:
  // - Usa fetch normalmente
  // - Em modo file:// ou erro de CORS/origem, tenta JSONP
  async function fetchNominatim(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Falha na rede");
      return await response.json();
    } catch (error) {
      if (isFileProtocol) {
        return await fetchNominatimJsonp(url);
      }
      throw error;
    }
  }

  async function fetchOverpass(query) {
    // Em produção (Vercel), usa o proxy serverless local para evitar CORS.
    // Em desenvolvimento local (file:// ou localhost), tenta direto.
    const isLocal =
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!isLocal) {
      // ✅ PRODUÇÃO: chama o proxy /api/overpass no próprio domínio
      const response = await fetch("/api/overpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          err.error || `Proxy falhou com status ${response.status}`,
        );
      }
      return await response.json();
    }

    // 🔧 DESENVOLVIMENTO LOCAL: tenta direto nos endpoints
    const endpoints = [
      "https://overpass-api.de/api/interpreter",
      "https://lz4.overpass-api.de/api/interpreter",
      "https://z.overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
    ];

    let lastError;
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `data=${encodeURIComponent(query)}`,
        });
        if (response.ok) return await response.json();
        console.warn(
          `Endpoint ${endpoint} falhou com status: ${response.status}`,
        );
      } catch (error) {
        console.warn(`Erro ao conectar com ${endpoint}:`, error);
        lastError = error;
      }
    }
    throw (
      lastError || new Error("Todos os servidores da API Overpass falharam.")
    );
  }

  function buildOverpassQuery(lat, lon, radiusMeters) {
    return `
/* Identificação: ReciclaConsciente/1.0 (https://reciclaconsciente.vercel.app/) */
[out:json][timeout:25];
(
  node["amenity"="recycling"](around:${radiusMeters},${lat},${lon});
  way["amenity"="recycling"](around:${radiusMeters},${lat},${lon});
  relation["amenity"="recycling"](around:${radiusMeters},${lat},${lon});

  node["recycling:electronics"="yes"](around:${radiusMeters},${lat},${lon});
  way["recycling:electronics"="yes"](around:${radiusMeters},${lat},${lon});
  relation["recycling:electronics"="yes"](around:${radiusMeters},${lat},${lon});

  node["waste"="electronics"](around:${radiusMeters},${lat},${lon});
  way["waste"="electronics"](around:${radiusMeters},${lat},${lon});
  relation["waste"="electronics"](around:${radiusMeters},${lat},${lon});
);
out center tags;
`;
  }

  function normalizeOverpassElements(elements, userLat, userLon) {
    return elements
      .map((element) => {
        const lat = element.lat ?? element.center?.lat;
        const lon = element.lon ?? element.center?.lon;
        if (typeof lat !== "number" || typeof lon !== "number") return null;

        const tags = element.tags || {};
        const name = tags.name || tags.operator || "Ponto de coleta";
        const addressParts = [
          tags["addr:street"],
          tags["addr:suburb"],
          tags["addr:city"],
        ].filter(Boolean);
        const address =
          addressParts.length > 0
            ? addressParts.join(", ")
            : "Ecoponto na região";
        const openingHours = tags.opening_hours || null;
        const distance = calculateDistance(userLat, userLon, lat, lon);

        return { lat, lon, name, address, openingHours, distance };
      })
      .filter(Boolean)
      .filter((point) => point.distance <= SEARCH_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
  }

  function formatOpeningHours(openingHours) {
    if (!openingHours) return "Horário não informado";
    return openingHours
      .replace(/\bMo\b/g, "Seg")
      .replace(/\bTu\b/g, "Ter")
      .replace(/\bWe\b/g, "Qua")
      .replace(/\bTh\b/g, "Qui")
      .replace(/\bFr\b/g, "Sex")
      .replace(/\bSa\b/g, "Sáb")
      .replace(/\bSu\b/g, "Dom")
      .replace(/;/g, " | ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildGoogleDirectionsUrl(originLat, originLon, destLat, destLon) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLon}&destination=${destLat},${destLon}&travelmode=driving`;
  }

  async function findNearbyPoints(lat, lon) {
    if (!map) initMap();
    mapLoader.classList.remove("d-none");
    listaPontos.innerHTML = `<p class="text-center p-4">Buscando ecopontos em um raio de ${SEARCH_RADIUS_KM} km...</p>`;

    markers.forEach((m) => map.removeLayer(m));
    markers = [];
    if (userMarker) map.removeLayer(userMarker);

    try {
      console.log("[Ecopontos] Busca iniciada:", {
        lat,
        lon,
        raioKm: SEARCH_RADIUS_KM,
      });

      map.setView([lat, lon], 13);
      userMarker = L.marker([lat, lon], {
        icon: L.divIcon({
          className: "user-marker",
          html: '<i class="fas fa-user-circle" style="color: #3498db; font-size: 24px;"></i>',
        }),
      })
        .addTo(map)
        .bindPopup("Você está aqui")
        .openPopup();

      const overpassQuery = buildOverpassQuery(lat, lon, SEARCH_RADIUS_M);
      const overpassData = await fetchOverpass(overpassQuery);
      const points = normalizeOverpassElements(
        overpassData.elements || [],
        lat,
        lon,
      );

      console.log("[Ecopontos] Encontrados no raio:", points.length);

      if (points.length === 0) {
        listaPontos.innerHTML = `<p class="text-center p-4">Nenhum ecoponto encontrado em até ${SEARCH_RADIUS_KM} km da localização informada.</p>`;
        return;
      }

      listaPontos.innerHTML = "";
      points.forEach((point) => {
        const marker = L.marker([point.lat, point.lon]).addTo(map);
        marker.bindPopup(
          `<b>${point.name}</b><br>${point.address}<br><small>${formatOpeningHours(point.openingHours)}</small>`,
        );
        markers.push(marker);

        const origin = currentSearchOrigin || { lat, lon };
        const directionsUrl = buildGoogleDirectionsUrl(
          origin.lat,
          origin.lon,
          point.lat,
          point.lon,
        );

        const itemDiv = document.createElement("div");
        itemDiv.className = "ponto-item";
        itemDiv.innerHTML = `
                    <div class="ponto-header">
                        <span class="category-tag tag-public">Público / Ecoponto</span>
                        <h4>${point.name}</h4>
                    </div>
                    <p>${point.address}</p>
                    <p><strong>Funcionamento:</strong> ${formatOpeningHours(point.openingHours)}</p>
                    <span class="distancia"><i class="fas fa-route"></i> ${point.distance.toFixed(1)} km</span>
                    <a class="maps-route-link" href="${directionsUrl}" target="_blank" rel="noopener noreferrer" title="Abrir rota no Google Maps">
                      <i class="fab fa-google"></i> Rota no Google Maps
                    </a>
                `;
        itemDiv.onclick = () => {
          map.setView([point.lat, point.lon], 16);
          marker.openPopup();
        };
        listaPontos.appendChild(itemDiv);
      });
    } catch (error) {
      console.error("[Ecopontos] Erro na busca:", error);
      listaPontos.innerHTML =
        '<p class="text-center p-4">Erro ao buscar ecopontos. Tente novamente em alguns instantes.</p>';
    } finally {
      mapLoader.classList.add("d-none");
    }
  }

  document.getElementById("btn-location").addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentSearchOrigin = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        findNearbyPoints(pos.coords.latitude, pos.coords.longitude);
      },
      (error) => {
        console.error("[Ecopontos] Erro de geolocalização:", error);
        alert("Erro ao acessar localização.");
      },
    );
  });

  async function searchAddress() {
    const query = addressInput.value;
    if (!query) return;
    try {
      console.log("[Ecopontos] Geocodificando endereço:", query);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const data = await fetchNominatim(url);
      if (data.length > 0) {
        currentSearchOrigin = {
          lat: Number(data[0].lat),
          lon: Number(data[0].lon),
        };
        await findNearbyPoints(Number(data[0].lat), Number(data[0].lon));
      } else alert("Endereço não encontrado.");
    } catch (e) {
      console.error("[Ecopontos] Erro ao buscar endereço:", e);
      alert(
        "Erro na busca de endereço. Se estiver abrindo por arquivo local, use um servidor local (http://localhost).",
      );
    }
  }

  document
    .getElementById("btn-search")
    .addEventListener("click", searchAddress);
  addressInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchAddress();
    }
  });

  addLocalModeNotice();

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
});
