"use strict";
document.addEventListener("DOMContentLoaded", () => {
    // Быстрые действия
    localStorage.setItem("projects", JSON.stringify([]));
    let JS__project__list = JSON.parse(localStorage.getItem("projects"));
    updateProjectAside(".project-list");

    // дефолтные странички
    const home__page = document.querySelector(".page__item-home"),
        today__page = document.querySelector(".page__item-today"),
        week__page = document.querySelector(".page__item-week");
    // список проектов
    const DOM__project__list = document.querySelector(".project-list"), //ul
        project__item__btn__list =
            document.querySelectorAll(".project-item__btn");
    const aside=document.querySelector(".aside");
    // Input
    const data__input = document.querySelector(".task__right-input"),
        project__input = document.querySelector(".add-project__modal-input"),
        task__input = document.querySelector(".add-task__modal-input");
    // Кнопки
    const add__project__btn = document.querySelector(".add-project-wrapper");
    const add__project__add = document.querySelector(".add-project__modal-add");
    const cancel__project__btn = document.querySelector(
        ".add-project__modal-cancel"
    );
    const project__modal = add__project__btn.querySelector(".project__modal");

    class Project {
        name = home;
        tasks;
        constructor(name) {
            if (name.length > 20) {
                this.name = `${name.slice(0, 20)}...`;
            } else {
                this.name = name;
            }
            this.tasks = [];
        }
        addTask(task) {
            this.tasks.push(task);
        }
        deleteTask(taskName) {
            this.tasks = this.tasks.filter((task) => task.name != taskName);
        }
    }
    class Task {
        name;
        dueDate = "No Date";
        constructor(name, dueDate) {
            this.name = name;
            this.dueDate = dueDate;
        }
    }
    // Выводит название активного проекта
    function nowProjectActive() {
        if (home__page.classList.contains("active"))
            return home__page.querySelector(".page__item-title").textContent;
        else if (today__page.classList.contains("active"))
            return today__page.querySelector(".page__item-title").textContent;
        else if (week__page.classList.contains("active"))
            return week__page.querySelector(".page__item-title").textContent;
        for (let elem of project__item__btn__list) {
            if (elem.classList.contains("active"))
                return elem.querySelector(".project-item__btn-title")
                    .textContent;
        }
    }
    // Добавляет элементу класс active
    function setActive(element) {
        if (!element.classList.contains("active")) {
            element.classList.add("active");
        }
    }
    // Убирает у элемента класс active
    function delAcive(element) {
        element.classList.remove("active");
    }
    function delActiveProject(){
        home__page.classList.remove("active");
        today__page.classList.remove("active")
        week__page.classList.remove("active")
        for (let elem of project__item__btn__list) {
            elem.classList.remove("active");
        }
    }
    // Обноавляет список проектов из localStorage
    function updateProjectAside(parent) {
        let project__list = JSON.parse(localStorage.getItem("projects"));
        parent = document.querySelector(`${parent}`);
        parent.innerHTML = "";
        for (let i = 0; i < project__list.length; i++) {
            let newProject = document.createElement("li");
            newProject.classList.add("project-item");
            newProject.innerHTML = `
            <button type="button" class="project-item__btn">
                <div class="project-item__btn-left">
                    <svg class="page__icon">
                        <use xlink:href="#task-done"></use>
                    </svg>
                    <p class="project-item__btn-title">${project__list[i].name}</p>
                </div>
                <p class="project-item__btn-del">&#10006</p>
            </button>
            `;
            parent.append(newProject);
        }
    }
    function removeProject(name){
        JS__project__list.forEach((item,i)=>{
            if(item.name==name){
                JS__project__list.splice(i,1);
            }
        })
    }
    // Event Listeners
    add__project__btn.onclick = (e) => {
        if (e.target.classList.contains("add-project")) {
            setActive(project__modal);
        }
    };
    cancel__project__btn.onclick = () => {
        delAcive(project__modal);
    };
    add__project__add.onclick = () => {
        let valid = [
            ...document.querySelectorAll(".project-item__btn-title"),
        ].every((n) => n.textContent != project__input.value);
        if (valid) {
            let newProject = new Project(project__input.value);
            JS__project__list.push(newProject);
            localStorage.setItem("projects", JSON.stringify(JS__project__list));
            delAcive(project__modal);
            updateProjectAside(".project-list");
        } else {
            return
        }
    };
    aside.addEventListener("click",(e)=>{
        if(!(e.target.closest("button") || e.target.closest("li"))) return;
        if(e.target.closest("button")!=null){
            delActiveProject();
            setActive(e.target.closest("button"));
        }
        if(e.target.closest("li")!=null){
            delActiveProject();
            setActive(e.target.closest("li"));
        }
        if(e.target.classList.contains("project-item__btn-del")){
            let project__name=e.target.closest("button").querySelector(".project-item__btn-title").textContent;
            removeProject(project__name);
            localStorage.setItem("projects", JSON.stringify(JS__project__list));
            console.log(project__name)
            updateProjectAside(".project-list");
        }
    })





}); //DomContentLoaded
