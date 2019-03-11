// create connection
const socket = io.connect('https://165.227.168.164', {secure:true})
socket.on('connect', () => {
    console.log('connected!')
})
socket.on('notification', (data) => {
    let notification = document.getElementById('notification')
    let issue_col = document.querySelector('#issue > h2')
    let card = document.createElement('div')
    let header = document.createElement('div')
    let body = document.createElement('div')
    let title = document.createElement('h4')
    let message = document.createElement('p')
    let url = document.createElement('p')
    let type = document.createElement('p')

    card.className = 'card border-info mb-3'
    card.style = 'max-width: 20rem;'
    header.className = 'card-header'
    body.className = 'card-body text-info'
    title.className = 'card-title'
    message.className = 'card-text'
    url.className = 'card-text'
    type.className = 'card-text'

    if(data.type === 'comment'){
        let issue = document.getElementById(data.issue_id).getElementsByClassName('card-body')[0]
        let span = document.createElement('span')
        let br =  document.createElement('br')
        span.className = 'badge badge-warning'
        span.innerText = 'New comment by ' + data.author
        issue.appendChild(br)
        issue.appendChild(span)
    } else if(data.type === 'issue') {
        console.log('New issue!')
        let component =  document.createElement('div')
        let issueCard = document.createElement('div')
        let issueHeader = document.createElement('div')
        let issueBody = document.createElement('div')
        let issueTitle = document.createElement('h4')
        let issueURL = document.createElement('p')
        let issueCreated = document.createElement('p')
        let issueUpdated = document.createElement('p')
        let issueSpan = document.createElement('span')

        component.className = 'bs-component'
        component.id = data.issue_id
        issueCard.className = 'card text-white bg-info mb-3'
        issueCard.style = 'max-width: 20rem;'
        issueHeader.className = 'card-header'
        issueBody.className = 'card-body'
        issueTitle.className = 'card-title'
        issueURL.className = 'card-text'
        issueCreated.className = 'card-text'
        issueUpdated.className = 'card-text'
        issueSpan.className = 'badge badge-primary'

        issueHeader.innerText = 'Issue made by ' + data.author
        issueTitle.innerText = data.message
        issueURL.innerText = 'URL: ' + data.url
        issueCreated.innerText = 'Issue created on: ' + data.created
        issueUpdated.innerText = 'Issue updated on: ' + data.updated
        issueSpan.innerText = 'Number of comments:' + data.comments

        issueBody.appendChild(issueTitle)
        issueBody.appendChild(issueURL)
        issueBody.appendChild(issueCreated)
        issueBody.appendChild(issueUpdated)
        issueBody.appendChild(issueSpan)
        issueCard.appendChild(issueHeader)
        issueCard.appendChild(issueBody)
        component.appendChild(issueCard)
        issue_col.after(component)
    }

    header.innerText = data.author
    title.innerText = 'Action: ' + data.title
    message.innerText = 'Content: ' + data.message
    url.innerText = 'URL: ' + data.url
    type.innerText = 'Type: ' + data.type
    body.appendChild(title)
    body.appendChild(url)
    body.appendChild(type)
    card.appendChild(header)
    card.appendChild(body)
    notification.appendChild(card)
})
