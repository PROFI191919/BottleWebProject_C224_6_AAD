% rebase('layout.tpl', title=title, year=year)

<div class="content">
    <h1 class="topic-title">About authors</h1>
    <div class="space-y-8">

        <!-- Первый блок -->
        <div class="text-block">
           <div class="text-content">
    <h2>Demidova Svetlana Dmitrievna</h2>
    <p>The project leader is a talented web developer and designer, known for combining creative vision with technical expertise. She leads the team with passion and precision, creating visually appealing and user-friendly websites.</p>
    <h3>Main Sections of the Project</h3>
    <ul>
        <li>Home Page</li>
        <li>Theory of Recommendation System</li>
        <li>Practical Module for Building a Recommendation System</li>
        <li>Design of Web Site</li>
    </ul>
</div>
            <div class="image-container">
                <img src="/static/images/Sveta.jpg" alt="Musician Image">
            </div>
        </div>

        <div class="text-block">
            <div class="text-content">
                <h2>Antonov Erik Evgenievich</h2>
                <p>The backend developer is a skilled professional responsible for creating the server-side logic and database interactions. They ensure the seamless functioning of the application?s core features, focusing on performance, security, and data management.</p>
                <h3>Main Sections of the Project</h3>
                   <ul>
                    <li>Authors Page</li>
                    <li>Theory of Educational trajectory</li>
                    <li>Practical Module for Building a Educational trajectory</li>
                    <li>Backend part of WebSite</li>
                 </ul>
            </div>
            <div class="image-container">
                <img src="/static/images/Antonov.jpg" alt="Early Career">
            </div>
        </div>

        <div class="text-block">
            <div class="text-content">
                <h2>Andriyanov Andrey Alekseevich</h2>
                <p>The developer is a highly skilled and dedicated professional, responsible for building and maintaining the core functionality of applications. They ensure smooth and efficient operation, prioritizing performance, security, and data integrity while collaborating closely with other team members.</p>
                <h3>Main Sections of the Project</h3>
                   <ul>
                    <li>Navigation Panel</li>
                    <li>Theory of Community Detection with the Girvan-Newman Algorithm</li>
                    <li>Practical Module for Building a Community Detection with the Girvan-Newman Algorithm</li>
                    <li>Sigma GAY</li>
                 </ul>
            </div>
            <div class="image-container">
                <img src="/static/images/Andrey.jpg" alt="Latest Projects">
            </div>
        </div>
    </div>
</div>

<style>


.text-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    margin: 20px 0;
    background-color: #fff;
    border-radius: 15px;
}

.text-content {
    flex: 1;
    margin-right: 20px;
}

.image-container {
    flex-shrink: 0;
}

.image-container img {
    max-width: 180px;
    height: auto;
    object-fit: cover;
    border: 4px solid #6a5acd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
