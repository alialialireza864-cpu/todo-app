
const $ = document
const taskForm = $.querySelector('#taskForm')
const titleInput = $.querySelector('#title')
const descriptionInput = $.querySelector('#description')
const dateInput = $.querySelector('#date')
const taskList = $.querySelector('#taskList')
const filterBtns = $.querySelectorAll('.fab')
const editModal = $.querySelector('#editModal')
const closeEditModalBtn = $.querySelector('#closeEdit')
const editForm = $.querySelector('#editForm')
const editTitleInput = $.querySelector('#editTitle')
const editDescriptionInput = $.querySelector('#editDescription')
const editDateInput = $.querySelector('#editDate')
const deleteModal = $.querySelector('#deleteModal')
const confitmDeleteBtn = $.querySelector('#confirmDelete')
const cancelDeleteBtn = $.querySelector('#cancelDelete')
const messageBox = $.querySelector('#messageBox')

class Task{
    constructor(id,title,description,date,status){
        this.id = id
        this.title = title
        this.description = description
        this.date = date
        this.status = status
        newTaskManager.addTask(this) 
        console.log(this);
        addTaskToList(this)
    }
    getProperty(prop){
        switch (prop) {
            case 'title':
                return this.title
                case 'description':
                    return this.description
            case 'date':
                return this.date
                case 'status':
                    return this.status
                    case 'id':
                        return this.id
                        
                        default:
                            showMessage('property dose not exist','red' , 3000)
                            break;
                        }
                    }
                    getAllProperty(){
                        return this
    }
}
class TaskManager{
    constructor(){
        this.tasks = []
    }
    addTask(task){
        this.tasks.push(task)
    }
    removeTask(taskIndex){
        this.tasks.splice(taskIndex,1)
    }
    changeStatus(id,status){
        this.tasks[this.getIndexTask(id)].status = status
    }
    getTaskById(id){
        const index = this.tasks.findIndex(item=>{
            return item.id == id
        })
        return this.tasks[index]
    }
    editTask(task){
        this.tasks[this.getIndexTask(task.id)] = task
    }
    getIndexTask(taskId){
        const index = this.tasks.findIndex(item=>{
            return item.id == taskId
        })
        return index
    }
    getTasksBasedOnStatus(status){

        if (status === 'all') {
            return this.tasks
        } else {
            
            let tasks = this.tasks.filter(task=>{
                return task.status === status
            })
            return tasks
        }
    }
    getAllTasks(){
        return this
    }
}
const newTaskManager = new TaskManager()
function editTask() {
    const id = editForm.dataset.id
    const editedTask = {
        id:id,
        title:editTitleInput.value,
        description:editDescriptionInput.value,
        date:editDateInput.value,
        status:'pending'
    }
    newTaskManager.editTask(editedTask)
    fetch(`https://todolist-50271-default-rtdb.firebaseio.com/tasks/${id}.json`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(editedTask)
    }).then(res=>{
        if (res.ok) {
            editTitleInput.value = ''
            editDescriptionInput.value = ''
            editDateInput.value = ''
            const editedLi = $.querySelector(`li[data-id="${id}"]`)
            editedLi.querySelector('h3').textContent=editedTask.title
            editedLi.querySelector('p').textContent=editedTask.description
            editedLi.querySelector('small').textContent=`Due: ${editedTask.date}`
            showMessage('Task Edited Successfully!' , 'white' , 3000)
            closeEditModal()
        } else {
            throw new Error('can not edit task')
        }
    }).catch(err=>showMessage(err.message,'red',3000))

}
function closeEditModal() {
    editModal.style.display = 'none'
}
function openEditModal(id) {
    editModal.style.display = 'flex'
    editForm.dataset.id=id
    const task = newTaskManager.getTaskById(id)
    editTitleInput.value = task.title
    editDescriptionInput.value = task.description
    editDateInput.value = task.date
}

function doneTask(li) {
    const id = li.dataset.id
    let newStatus
    if (li.classList.contains('task-done')) {
        newStatus = 'pending'
    } else {
        newStatus = 'done'
    }
    fetch(`https://todolist-50271-default-rtdb.firebaseio.com/tasks/${id}.json`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: newStatus
            })
        }).then(res=>{
            if (res.ok) {
                newTaskManager.changeStatus(id,newStatus)
                li.classList.toggle('task-done');
                showMessage('Status Changed Successfully','white',3000)
            } else {
                throw new Error('can not change status')
            }
        }).catch(err=>showMessage(err.message ,'red', 3000))
    }
function addTaskToList(task) {
    console.log(task.status);
    let doneClass = ''
    if (task.status === 'done') {
        doneClass ='task-done'
    }
    const newLi = `<li data-id="${task.id}" class="task-item ${doneClass}">
    <div class="task-info">
          <h3>${task.title}</h3>
          <p class="desc">${task.description}</p>
          <small>Due: ${task.date}</small>
          </div>
          <div class="task-actions">
          <button onclick="doneTask(this.closest('li'))" class="done-btn">✔</button>
          <button onclick="openEditModal('${task.id}')" class="edit-btn">✏</button>
          <button onclick="openDeleteModal('${task.id}')" class="delete-btn">🗑</button>
        </div>
      </li>`
    
    taskList.insertAdjacentHTML('afterbegin', newLi)
}
function openDeleteModal(id) {
    deleteModal.dataset.id = id
    deleteModal.style.display = 'flex'
}
function closeDeleteModal() {
    deleteModal.style.display = 'none'
}
function deleteTask(e) {
    const taskId = deleteModal.dataset.id
    fetch(`https://todolist-50271-default-rtdb.firebaseio.com/tasks/${taskId}.json`,{
        method:'DELETE'
    }).then(res=>{
        if (res.ok) {
            const deleteLi = $.querySelector(`li[data-id="${taskId}"]`)
            deleteLi.remove()
            newTaskManager.removeTask(newTaskManager.getIndexTask(taskId))
            showMessage('Task Deleted Successfully!' , 'orange' , 3000)
            closeDeleteModal()
        } else {
            throw new Error('can not delete task')
        }
    }).catch(err=>showMessage(err.message,'red',3000))
    
    
}
function showMessage(message,color,ms) {
    messageBox.classList.add('show')
    messageBox.style.color = color
    messageBox.textContent = message
    setTimeout(()=>messageBox.classList.remove('show') , ms)
}
function getTaskFromBackend() {
    console.log('load');
    fetch('https://todolist-50271-default-rtdb.firebaseio.com/tasks.json')
    .then(res=>{
        if (res.ok) {
            return res.json()
        } else {
            throw new Error('can not get tasks from server')
        }
    }).then(data=>{
        
        if (data === null) {
            
        } else {
            data = new Map(Object.entries(data))
            
            data.forEach((task , id) => {
                
                const newTask = new Task(id,task.title,task.description,task.date,task.status)
            });
        }
    }).catch(err=>showMessage(err.message,'red',3000))
}
function filterList(e) {
    const filter = e.target.dataset.filter
    filterBtns.forEach(btn=>{
        if (btn.classList.contains('active-fab')) {
            btn.classList.remove('active-fab')
        }
    })
    e.target.classList.add('active-fab')
    let filtredTasks = newTaskManager.getTasksBasedOnStatus(filter)
    taskList.innerHTML=''
    filtredTasks.forEach(task=>addTaskToList(task))

}
function addNewTask() {
    const task={
        title: titleInput.value,
        description:descriptionInput.value,
        date: dateInput.value,
        status : 'pending'
    }
    fetch('https://todolist-50271-default-rtdb.firebaseio.com/tasks.json',{
        method:'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(task)
    }).then(res=>{
        if (res.ok) {
            return res.json()
        } else {
            throw new Error('can not add task')
        }
    }).then(data=>{
        titleInput.value = ''
    descriptionInput.value = ''
    dateInput.value = ''
        const newTask = new Task(data.name,task.title,task.description,task.date,task.status)
        showMessage('Task Added Successfully!' , 'green' , 3000)
    }).catch(err=>showMessage(err.message,'red',3000))
}
window.addEventListener('load' , getTaskFromBackend)
cancelDeleteBtn.addEventListener('click' , closeDeleteModal)
confitmDeleteBtn.addEventListener('click' , e=> deleteTask(e))
taskForm.addEventListener('submit' , e=>{
    e.preventDefault()
    addNewTask()
})
filterBtns.forEach(btn=>{
    btn.addEventListener('click' , (e)=> filterList(e))
})
closeEditModalBtn.addEventListener('click', closeEditModal)
editForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    editTask()
})