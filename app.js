const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const audio = document.querySelector("#audio");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const musicListUL = document.querySelector("#music-list ul");

const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
});

function displayMusic(music) {
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
});

prev.addEventListener("click", () => {
    prevMusic();
});

next.addEventListener("click", () => {
    nextMusic();
});

const prevMusic = () => {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

const nextMusic = () => {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

const pauseMusic = () => {
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}

const playMusic = () => {
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause";
    audio.play();
}

const formatTime = (time) => {
    let min = Math.floor(time / 60);
    min = min < 10 ? `0${min}` : min;

    let sec = Math.floor(time % 60);
    sec = sec < 10 ? `0${sec}` : sec;

    return min + ":" + sec;
};

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = formatTime(progressBar.value);
});

volumeBar.addEventListener("input", () => {
    const volumeValue = volumeBar.value;
    audio.volume = volumeValue / 100;
    if (volumeValue == 0) {
        volume.classList = "fa-solid fa-volume-xmark";
    } else {
        volume.classList = "fa-solid fa-volume-high";
    }
});

volume.addEventListener("click", () => {
    if (volume.classList.contains("fa-volume-high")) {
        volume.classList = "fa-solid fa-volume-xmark";
        audio.muted = true;
        volumeBar.value = 0;
    } else {
        volume.classList = "fa-solid fa-volume-high";
        audio.muted = false;
        volumeBar.value = 100;
    }
});

progressBar.addEventListener("input", () => {
    currentTime.textContent = formatTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

const displayMusicList = (list) => {
    for (let i = 0; i < list.length; i++) {
        let li =
            `<li li-index='${i}' onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${list[i].getName()}</span>
                    <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                    <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
            </li>`;
        musicListUL.insertAdjacentHTML("beforeend", li);
        let liAudioDuration = musicListUL.querySelector(`.music-${i}`);
        let liAudioTag = musicListUL.querySelector(`#music-${i}`);
        liAudioDuration.addEventListener("loadeddata", () => {
            liAudioTag.textContent = formatTime(liAudioDuration.duration);
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
    for (let li of musicListUL.querySelectorAll("li")) {
        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        } else {
            li.classList.remove("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    nextMusic();
});
