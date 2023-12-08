<template>
    <div id='timeDiv'>
        <ul id='timeline'>
            <li class='work' v-for="v in 10" :key="'timeline'+v">
                <input class='radio' :id="'work'+v" name='works' type='radio' :checked="!v" />
                <div class="relative">
                    <label :for="'work'+v">{{v}}、标题一</label>
                    <span class='date'>T{{v}}</span>
                    <span class='circle'></span>
                </div>
                <div class='content'>
                    <p>长安元年（701年），李白，字太白。其生地今一般认为是唐剑南道绵州（巴西郡）昌隆（后避玄宗讳改为昌明）青莲乡。祖籍为甘肃天水。
                    其家世、家族皆不详。据《新唐书》记载，李白为兴圣皇帝（凉武昭王李暠）九世孙，按照这个说法李白与李唐诸王同宗，是唐太宗李世民的同辈族弟。
                    亦有说其祖是李建成或李元吉。</p>
                    <p><img src="http://i.qulishi.com/UploadFile/2014-7/2014725171362.jpg" /></p>
                </div>
            </li>
        </ul>
    </div>
</template>
<style scoped lang="scss">
#timeDiv{
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 5%;
    font-size: 100%;
    font-family: "Noto Sans", sans-serif;
    color: black;
    background: white;
}
#timeline {
    list-style: none;
    margin: 50px 0 30px 120px;
    padding-left: 30px;
    border-left: 8px solid gray;
}
#timeline li {
    margin: 40px 0;
    position: relative;
}
#timeline p {
    margin: 0 0 15px;
}

.date {
    margin-top: -10px;
    top: 50%;
    left: -80px;
    font-size: 0.95em;
    line-height: 20px;
    position: absolute;
}

.circle {
    margin-top: -15px;
    top: 50%;
    left: -49px;
    width: 20px;
    height: 20px;
    background: white;
    border: 5px solid gray;
    border-radius: 50%;
    display: block;
    position: absolute;
}

.content {
    max-height: 20px;
    padding: 70px 20px 0;
    border-color: transparent;
    border-width: 2px;
    border-style: solid;
    border-radius: 0.5em;
    position: relative;
}
.content:before, .content:after {
    content: "";
    width: 0;
    height: 0;
    border: solid transparent;
    position: absolute;
    pointer-events: none;
    right: 100%;
}
.content:before {
    border-right-color: inherit;
    border-width: 20px;
    top: 50%;
    margin-top: -20px;
}
.content:after {
    border-right-color: white;
    border-width: 17px;
    top: 50%;
    margin-top: -17px;
}
.content p {
    max-height: 0;
    color: transparent;
    text-align: justify;
    word-break: break-word;
    hyphens: auto;
    overflow: hidden;
}
label {
    font-size: 1.3em;
    position: absolute;
    z-index: 100;
    cursor: pointer;
    top: 35px;
    transition: transform 0.2s linear;
    font-weight: bold;
}

.radio {
    display: none;
}

.radio:checked + .relative label {
    cursor: auto;
    transform: translateX(42px);
}
.radio:checked + .relative .circle {
    background: red;
}
.radio:checked ~ .content {
    max-height: 200000px;
    border-color: lightgray;
    margin-right: 20px;
    transform: translateX(20px);
    transition: max-height 0.4s linear, border-color 0.5s linear, transform 0.2s linear;
}
.radio:checked ~ .content p {
    max-height: 200000px;
    color: black;
    transition: color 0.3s linear 0.3s;
}
/* -------------------------------------
* mobile phones (vertical version only)
* ------------------------------------- */
@media screen and (max-width: 767px) {
    #timeline {
        margin-left: 0;
        padding-left: 0;
        border-left: none;
    }
    #timeline li {
        margin: 50px 0;
    }

    label {
        width: 85%;
        font-size: 1.1em;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
        transform: translateX(18px);
    }

    .content {
        padding-top: 60px;
        border-color: #eee9dc;
    }
    .content:before, .content:after {
        border: solid transparent;
        bottom: 100%;
    }
    .content:before {
        border-bottom-color: inherit;
        border-width: 17px;
        top: -16px;
        left: 50px;
        margin-left: -17px;
    }
    .content:after {
        border-bottom-color: white;
        border-width: 20px;
        top: -20px;
        left: 50px;
        margin-left: -20px;
    }
    .content p {
        font-size: 0.9em;
        line-height: 1.4;
    }

    .circle, .date {
        display: none;
    }
}
</style>