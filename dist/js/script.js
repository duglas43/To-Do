"use strict";
document.addEventListener("DOMContentLoaded", () => {
    class Project {
        active=false;
        name;
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
        completed=false;
        name;
        dueDate="No Date";
        constructor(name, dueDate="No Date") {
            this.name = name;
            this.dueDate = dueDate;
        }
    }
    // Aside
    const aside=document.querySelector(".aside"); // блок с проектами+страницами
    const pageItems=document.querySelectorAll(".page__item"); // массив default страниц
    const projectList=document.querySelector(".project-list"); // блок с проектами
    const projectItems=document.querySelectorAll(".project-item__btn");// массив проектов
    const addProject=document.querySelector(".add-project-wrapper");//кнопка добавления проекта
    const projectModal=document.querySelector(".project__modal");// модальное окно добавления проекта
    const addProjectModal=document.querySelector(".add-project__modal-add");// кнопка добавления проекта в модальном окне
    const cancelProjectModal=document.querySelector(".add-project__modal-cancel");// кнопка отмены добавления проекта в модальном окне
    const inputProjectModal=document.querySelector(".add-project__modal-input");// поле ввода названия проекта в модальном окне
    // инициализация проектов из локального хранилища
    let projects;
    localStorage.projects===undefined ? projects=[] : projects=JSON.parse(localStorage.getItem("projects"));
    // создание default страниц
    let homepage=new Project("Домашняя страница");
    homepage.active=true;
    let todayPage=new Project("Задачи на сегодня");
    let week= new Project("Задачи этой недели");
    let pages;
    localStorage.pages === undefined? pages=[homepage, todayPage, week] : pages=JSON.parse(localStorage.getItem("pages"));
    let pagesProjectsList= pages.concat(projects);// массив default страниц и проектов
    projects.forEach(i=>i.active=false);
    pages.forEach(i=>i.active=false);
    pages[0].active=true;
    updateLocal();
    updateProjectHTML();
    updateTaskHTML();
    // Добавляет класс active к элементу
    function setActive(element) {
        if (element.active!=undefined){
            projects.forEach(i=>i.active=false);
            pages.forEach(i=>i.active=false);
            element.active ? element.active=false : element.active=true;
        }
        else{
            element.classList.add("active");
        }
        updateLocal();
    }
    // Удаляет класс active у элемента
    function delAcive(element) {
        if (element.active!==undefined){
            projects.forEach(i=>i.active=false);
            pages.forEach(i=>i.active=false);
            element.active ? element.active=false : element.active=true;
        }
        else{
            element.classList.remove("active");
        }
        updateLocal();
    }
    // Показывает активное меню
    function nowProjectActive() {
        for(let elem of pagesProjectsList){
            if(elem.active){
                return elem;
            }
        }
    }
    // Обновляет локальное хранилище
    function updateLocal(){
        pagesProjectsList= pages.concat(projects);
        localStorage.setItem("projects", JSON.stringify(projects));
        localStorage.setItem("pagesProjects", JSON.stringify(pagesProjectsList));
        localStorage.setItem("pages", JSON.stringify(pages));
    }
    // Удаляет прокт из локального хранилища по имени
    function removeProject(id){
        projects=projects.filter((project) => project.id != id);
        updateLocal();
    }
    // 
    function updateProjectHTML() {
        let parent = document.querySelector(".project-list");
        parent.innerHTML = "";
        for (let i = 0; i < projects.length; i++) {
            let newProject = document.createElement("li");
            newProject.classList.add("project-item");
            newProject.dataset.id=i+3;
            newProject.innerHTML = `
            <button type="button" class="project-item__btn">
                <div class="project-item__btn-left">
                    <svg class="page__icon">
                        <use xlink:href="#task-done"></use>
                    </svg>
                    <p class="project-item__btn-title">${projects[i].name}</p>
                </div>
                <p class="project-item__btn-del">&#10006</p>
            </button>
            `;
            parent.append(newProject);
        }

    }
    function addProjectfunction(e){
        let valid=projects.every(n=>n.name!=inputProjectModal.value);
        if (valid) {
            projects.push(new Project(inputProjectModal.value));
            updateLocal();
            updateProjectHTML();
            delAcive(projectModal);
            e.stopPropagation();
        }
    }
    function updateTaskHTML(){
        document.querySelector(".tasks__title").textContent=nowProjectActive().name;
        let parent = document.querySelector(".task-list");
        parent.innerHTML = "";
        for (let i = 0; i < nowProjectActive().tasks.length; i++) {
            let newTask = document.createElement("li");
            newTask.classList.add("task");
            newTask.dataset.id=i;
            newTask.innerHTML = `
            <div class="task__left">
                <p class="task__left-circle"></p>
                <p class="task__left-title">${nowProjectActive().tasks[i].name}</p>
            </div>
            <div class="task__right">
                <p class="task__right-date">${nowProjectActive().tasks[i].dueDate}</p>
                <input type="date" name="task-date-input" class="task__right-input">
                <p class="task__right-del">&#10006</p>
            </div>
            `;
            parent.append(newTask);
        }
    }
    function changeProject(e){
        document.querySelectorAll(".project-item__btn").forEach(item=>{
            delAcive(item);
        })
        for(let elem of pageItems){
            delAcive(elem);
        }
        if(aside.classList.contains("active")){
            aside.classList.remove("active");
            document.querySelector(".tasks").style.display="block";
        }
        setActive(e.target.closest("button"));
        setActive(pagesProjectsList[e.target.closest("li").dataset.id]);
        updateTaskHTML();
    }
    // Event listeners
    addProject.onclick=()=>{setActive(projectModal)};
    cancelProjectModal.onclick=(e)=>{
        delAcive(projectModal);
        e.stopPropagation();
    }
    addProjectModal.onclick=(e)=>{
        addProjectfunction(e);
    }
    addProjectModal.addEventListener("keydown", (e) => {
        if (e.keyCode == 13) {
            addProjectfunction(e);
        }
    })
    aside.addEventListener("click", (e) => {
        if (!e.target.closest("button") && !e.target.closest("li")) return;
        if(e.target.closest("li").dataset.id==1){
            document.querySelector(".add-task-wrapper").classList.add("hidden");
            pages[1].tasks=addTodayTask();
            updateLocal();
            changeProject(e);
        }
        if(e.target.closest("li").dataset.id==2){
            document.querySelector(".add-task-wrapper").classList.add("hidden");
            pages[2].tasks=addWeekTask();
            updateLocal();
            changeProject(e);
        }
        if(e.target.closest("li").dataset.id==0 || e.target.closest("li").dataset.id>=3){
            document.querySelector(".add-task-wrapper").classList.remove("hidden");
            changeProject(e);
        }
        if(e.target.classList.contains("project-item__btn-del")){
            removeProject(e.target.closest("li").dataset.id);
            updateProjectHTML();
            updateTaskHTML();
        }
    });
    
    //task
    function addTodayTask(){
        function formatTodayDate() {
            var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
        
            return [year, month, day].join('-');
        }
        let today=formatTodayDate();
        let todayTasks=[];
        let allTasks=[]
        let pagesProjectsListCopy=[...pagesProjectsList];
        pagesProjectsListCopy.splice(1,2);
        for(let i=0;i<pagesProjectsListCopy.length;i++){
            allTasks.push(...pagesProjectsListCopy[i].tasks);
        }
        for(let i=0;i<allTasks.length;i++){
            if(allTasks[i].dueDate==today){
                todayTasks.push(allTasks[i]);
            }
        }
        return(todayTasks)
    }
    function addWeekTask(){
        let today=new Date();
        let weekTasks=[];
        let allTasks=[]

        let pagesProjectsListCopy=[...pagesProjectsList];
        pagesProjectsListCopy.splice(1,2);
        for(let i=0;i<pagesProjectsListCopy.length;i++){
            allTasks.push(...pagesProjectsListCopy[i].tasks);
        }
        
        for(let i=0;i<allTasks.length;i++){
            let inputDate=new Date(allTasks[i].dueDate);
            if(inputDate.getTime()-today.getTime()<=604800000 && inputDate.getDay()>=today.getDay() ){
                weekTasks.push(allTasks[i]);
            }
        }
        return(weekTasks);
        
    }
    let taskList=document.querySelector(".task-list");
    let taskAdd=document.querySelector(".add-task-wrapper");
    let taskAddModal=taskAdd.querySelector(".add-task__modal");
    let taskAddInput=taskAdd.querySelector(".add-task__modal-input");
    let taskAddCancel=taskAdd.querySelector(".add-task__modal-cancel");
    let taskAddAdd=taskAdd.querySelector(".add-task__modal-add");

    taskAdd.addEventListener("click",(e)=>{
        setActive(taskAddModal);
    })
    taskAddCancel.onclick=(e)=>{
        delAcive(taskAddModal);
        e.stopPropagation();
    }
    taskAddAdd.onclick=(e)=>{
        nowProjectActive().tasks.push(new Task(taskAddInput.value));
        updateLocal();
        updateTaskHTML();
        delAcive(taskAddModal);
        e.stopPropagation();
    }
    taskAdd.addEventListener("keydown",(e)=>{
        if(e.keyCode==13){
            nowProjectActive().tasks.push(new Task(taskAddInput.value));
            updateLocal();
            updateTaskHTML();
            delAcive(taskAddModal);
            e.stopPropagation();
        }
    })
    taskList.addEventListener("click",(e)=>{
        if(e.target.closest(".task__right-del") || e.target.closest(".task__left-circle")){
        nowProjectActive().tasks.splice(e.target.closest("li").dataset.id,1);
        updateLocal();
        updateTaskHTML();
        }
        else if(e.target.closest(".task__right-date")){
            setActive(e.target.nextElementSibling);
        }
    })
    taskList.addEventListener("change",(e)=>{
        if(e.target.closest(".task__right-input")){
            nowProjectActive().tasks[e.target.closest("li").dataset.id].dueDate=e.target.value;
            updateLocal();
            updateTaskHTML();
            addTodayTask();
        }
    })
    // Мобильная адаптация
    let burger=document.querySelector(".burger");
    burger.onclick=(e)=>{
        setActive(aside);
        document.querySelector(".tasks").style.display="none";
    }
    
});//DomContentLoaded

