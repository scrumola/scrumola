import { Input, Component } from '@angular/core';

@Component({
    selector: 'story-snippet',
    templateUrl: './story-snippet.component.html',
    styleUrls: ['./story-snippet.component.css']
})

export class StorySnippetComponent {
    @Input() storySnippet;
}
