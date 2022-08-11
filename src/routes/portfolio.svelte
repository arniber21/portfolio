<script lang="ts">
    import Header from "../lib/Header.svelte";
	import Card from "../lib/Card.svelte";

</script>

<Header> Portfolio </Header>


<div class="flex flex-row">
    <Card path="#" img="PortfolioPreview.png" alt="Portfolio Image" header="Portfolio Website">
        Portfolio Website created using SvelteKit and Tailwind. Components by Flowbite were used. 
    </Card>
    <Card path="https://8by8.us" img="8by8preview.png" alt="8by8 Website" header="8by8"> 
        Major Contributor to the 8by8 Project, an app with the goal of increasing voter turnout among Asian Americans.
        Project stack includes React and Firebase. Implemented authentication.  Contributed to various bug fixes and code structure issues. 
    </Card>
    <Card path="https://github.com/arniber21/svelte-todo" img="SvelteTodoPreview.png" alt="Svelte Todo Image" header="Svelte Todo Application">
        A basic Todo application built with Svelte and Bootstrap. It shows off the basic features of the framework.
        Bootstrap was used as styling was not too important and I just wanted it to look good.
    </Card>
    <Card header="Bindr">
        Bindr - an app that consolidates Assignments and Courses across different LMS systems (Canvas, Google Classroom, etc).
        I made this because it was annoying having to check assignments from many different places - and also because some LMS
        including Schoology were very ugly. You won't find a link to this just yet - it's still in production and will potentially
        be a startup soon.
    </Card>

    <Card path="https://weather.arnabg.me" img="WeatherPreview.png" header="Svelte Weather App">
        A basic weather app in Svelte and Bootstrap. I built this to get more comfortable with Svelte. It's pretty simple and uses
        a prebuilt Weather API.
    </Card>
</div>
