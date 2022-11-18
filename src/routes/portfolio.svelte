<script lang="ts">
    import Header from "../lib/Header.svelte";
	import Card from "../lib/Card.svelte";

</script>

<Header> Portfolio </Header>


<div class="flex flex-row flex-wrap justify-center">
    <Card path="#" img="PortfolioPreview.png" alt="Portfolio Image" header="Portfolio Website">
        Portfolio Website created using SvelteKit and Tailwind. Components by Flowbite were used. 
    </Card>
    <Card path="https://8by8.us" img="8by8preview.png" alt="8by8 Website" header="8by8"> 
        Major Contributor to the 8by8 Project, an app with the goal of increasing voter turnout among Asian Americans.
        Project stack includes React and Firebase. Implemented authentication.  Contributed to various bug fixes and code structure issues. 
    </Card>
    <Card path="https://todo.arnabg.me" img="SvelteTodoPreview.png" alt="Svelte Todo Image" header="Svelte Todo Application">
        A basic Todo application built with Svelte and Bootstrap. It shows off the basic features of the framework.
        Bootstrap was used as styling was not too important and I just wanted it to look good.
    </Card>
    <Card header="Bindr" path="https://bindr.arnabg.me" img="BindrPreview.png">
        Bindr - an app that consolidates Assignments and Courses across different LMS systems (Canvas, Google Classroom, etc).
        I made this because it was annoying having to check assignments from many different places - and also because some LMS
        including Schoology were very ugly. It is the most ambitious project I've ever undertaken.
    </Card>

    <Card path="https://weather.arnabg.me" img="WeatherPreview.png" header="Svelte Weather App">
        A basic weather app in Svelte and Bootstrap. I built this to get more comfortable with Svelte. It's pretty simple and uses
        a prebuilt Weather API.
    </Card>

    <Card path="https://calculator.arnabg.me" img="CalculatorPreview.png" header="Javascript Calculator" >
        A basic calculator built in JavaScript. Made in Svelte. I love this project because it shows off how versatile and awesome stores in Svelte are.
    </Card>

    <Card path="https://react-todo.arnabg.me" img="ReactTodoPreview.png" header="React Todo App">
        A small todo app built in React. I made this to get comfortable with the very basics of React and get used to state management using Jotai,
        rather than the React included State and Context API's (which are often a pain to deal with).
    </Card>

    <Card path="https://url.arnabg.me" img="URLPreview.png" header="URL Shortener">
        A URL shortener made in Next.js (React), Planetscale, and Prisma. My main motivation behind this project was to get used to
        the Next.JS API stuff as well as Prisma and Planetscale. Prisma in particularly is very helpful and streamlined this process.
    </Card>
</div>
