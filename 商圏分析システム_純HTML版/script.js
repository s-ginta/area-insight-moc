(() => {
  const screens = [...document.querySelectorAll("[data-screen]")];
  const navButtons = [...document.querySelectorAll("[data-nav]")];
  const sidebarButtons = [...document.querySelectorAll(".nav [data-nav]")];
  const breadcrumb = document.getElementById("breadcrumb-title");
  const titles = { properties: "物件一覧", new: "新規物件分析", dashboard: "分析ダッシュボード" };

  function showScreen(name) {
    screens.forEach((screen) => { screen.hidden = screen.dataset.screen !== name; });
    sidebarButtons.forEach((button) => button.classList.toggle("active", button.dataset.nav === name));
    breadcrumb.textContent = titles[name];
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navButtons.forEach((button) => button.addEventListener("click", (event) => {
    event.preventDefault();
    if (button.dataset.nav) showScreen(button.dataset.nav);
  }));

  const search = document.getElementById("property-search");
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll("#property-rows tr").forEach((row) => {
      row.hidden = !row.dataset.search.toLowerCase().includes(query);
    });
  });

  const empty = document.getElementById("upload-empty");
  const reading = document.getElementById("upload-reading");
  const done = document.getElementById("upload-done");
  const fileInput = document.getElementById("file-input");
  const fileName = document.getElementById("reading-file-name");
  const dropzone = document.getElementById("dropzone");
  const stepConfirm = document.getElementById("step-confirm");

  function processFile(name = "渋谷駅前テナント_マイソク.pdf") {
    fileName.textContent = name;
    empty.hidden = true;
    done.hidden = true;
    reading.hidden = false;
    window.setTimeout(() => {
      reading.hidden = true;
      done.hidden = false;
      stepConfirm.classList.add("active");
    }, 2100);
  }

  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) processFile(fileInput.files[0].name);
  });
  document.getElementById("sample-upload").addEventListener("click", () => processFile());
  ["dragenter", "dragover"].forEach((type) => dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    dropzone.style.borderColor = "#1e5ed8";
  }));
  ["dragleave", "drop"].forEach((type) => dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    dropzone.style.borderColor = "";
  }));
  dropzone.addEventListener("drop", (event) => {
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile.name);
  });

  document.getElementById("start-analysis").addEventListener("click", (event) => {
    event.preventDefault();
    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = "商圏データを集計中...";
    window.setTimeout(() => {
      button.disabled = false;
      button.textContent = "商圏分析を開始 ›";
      showScreen("dashboard");
    }, 1300);
  });

  const areaData = {
    walk: { label: "徒歩商圏", sub: "徒歩15分圏", time: "15分", population: "82,400人", path: "M260 90C380 35 563 51 679 125c93 59 103 165 31 232-72 66-235 83-360 44-125-39-207-121-180-211 13-45 45-77 90-100Z", color: "#2a6bdc" },
    car: { label: "自動車商圏", sub: "自動車10分圏", time: "10分", population: "164,200人", path: "M150 57C330 11 659 29 797 111c108 64 93 205-47 273-134 65-408 55-582-22C29 301 13 176 113 91c12-11 24-22 37-34Z", color: "#1a8797" },
    station: { label: "駅利用圏", sub: "渋谷駅乗降動線", time: "3分", population: "96,800人", path: "M390 59c115-41 248 16 291 92 38 70-12 147-117 193-81 36-180 16-223-41-32-42-14-78-68-110-57-33-31-94 50-115 22-6 50-13 74-19Z", color: "#765cbe" }
  };
  document.querySelectorAll("#trade-tabs button").forEach((button) => button.addEventListener("click", () => {
    const data = areaData[button.dataset.mode];
    document.querySelectorAll("#trade-tabs button").forEach((item) => item.classList.toggle("active", item === button));
    const area = document.getElementById("trade-area");
    area.setAttribute("d", data.path);
    area.style.stroke = data.color;
    document.getElementById("area-label").textContent = data.label;
    document.getElementById("area-sub").textContent = data.sub;
    document.getElementById("area-time").textContent = data.time;
    document.getElementById("area-pop").textContent = data.population;
  }));
  document.getElementById("toggle-heat").addEventListener("change", (event) => {
    document.getElementById("heat-layer").style.display = event.target.checked ? "" : "none";
  });
  document.getElementById("toggle-competitors").addEventListener("change", (event) => {
    document.getElementById("competitor-layer").style.display = event.target.checked ? "" : "none";
  });

  document.querySelectorAll("#detail-tabs button").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("#detail-tabs button").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll("[data-detail-pane]").forEach((pane) => pane.classList.toggle("active", pane.dataset.detailPane === button.dataset.detail));
  }));

  document.getElementById("jump-calc").addEventListener("click", () => document.getElementById("calculation").scrollIntoView({ behavior: "smooth" }));
  document.getElementById("toggle-notes").addEventListener("click", (event) => {
    const hidden = document.getElementById("calc-steps").classList.toggle("hide-notes");
    event.currentTarget.textContent = hidden ? "ⓘ 補正説明を表示" : "ⓘ 補正説明を閉じる";
  });
})();
