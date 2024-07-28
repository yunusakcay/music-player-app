const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#prev");
const play = document.querySelector("#play");
const next = document.querySelector("#next");
const duration = document.querySelector("#duration");
const current_time = document.querySelector("#current-time");
const progress_bar = document.querySelector("#progress-bar");
const volume_bar = document.querySelector("#volume-bar");
const volume = volume_bar.previousElementSibling;
const volume_value = volume_bar.nextElementSibling;
const ul = document.querySelector("#music-list ul");

const player = new MusicPlayer(musicList);

window.addEventListener("load", startMusic = () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
});

const displayMusic = (music) => {
    title.innerHTML = music.title;
    singer.innerHTML = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

play.parentElement.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
});

prev.parentElement.addEventListener("click", () => { prevMusic(); });

const prevMusic = () => {
    player.previous();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

next.parentElement.addEventListener("click", () => { nextMusic(); });

const nextMusic = () => {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

const pauseMusic = () => {
    container.classList.remove("playing");
    play.classList = "fa-solid fa-play";
    audio.pause();
}

const playMusic = () => {
    container.classList.add("playing");
    play.classList = "fa-solid fa-pause";
    audio.play();
}

const calculateTime = (seconds) => {
    const minute = Math.floor(seconds / 60);
    const second = Math.floor(seconds % 60);
    const newsecond = second < 10 ? `0${second}` : `${second}`;
    const sonuc = `${minute}:${newsecond}`;
    return sonuc;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progress_bar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progress_bar.value = Math.floor(audio.currentTime);
    current_time.textContent = calculateTime(progress_bar.value);
});

progress_bar.addEventListener("input", () => {
    current_time.textContent = calculateTime(progress_bar.value);
    audio.currentTime = progress_bar.value;
});


volume.addEventListener("click", () => {
    if (volume.classList == "fa-solid fa-volume-high") {
        audio.muted = true;
        volume.classList = "fa-solid fa-volume-xmark";
        volume_bar.value = 0;
    } else {
        audio.muted = false;
        volume.classList = "fa-solid fa-volume-high";
        volume_bar.value = 100;
    }
});

volume_bar.addEventListener("input", (e) => {
    const value = e.target.value;
    volume_value.innerText = value;
    audio.volume = value / 100;
    if (value == 0) {
        audio.muted = true;
        volume.classList = "fa-solid fa-volume-xmark";
    } else {
        audio.muted = false;
        volume.classList = "fa-solid fa-volume-high";
    }
});

const displayMusicList = (list) => {

    ul.innerHTML = "";

    for (let i = 0; i < list.length; i++) {

        let liTag =
            `<li li-index="${[i]}" onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                <span>${list[i].title}</span>
                <span id="music-${list[i].id}" class="badge bg-primary rounded-pill"></span>
                <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
            </li>`;
        ul.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = ul.querySelector(`#music-${list[i].id}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        });
    }
}

const selectedMusic = (li) => {
    player.index = li.getAttribute("li-index");
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}

const isPlayingNow = () => {
    for (let li of ul.querySelectorAll("li")) {
        if (li.classList.contains("playing")) {
            li.classList.remove("playing");
        }

        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    nextMusic();
})
