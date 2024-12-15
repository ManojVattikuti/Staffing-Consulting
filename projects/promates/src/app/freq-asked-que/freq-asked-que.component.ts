import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-freq-asked-que',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule],
  templateUrl: './freq-asked-que.component.html',
  styleUrl: './freq-asked-que.component.scss'
})
export class FreqAskedQueComponent implements OnInit {

  frequentlyAskedQuestions: any = [
    {
      "question": "What is IT consulting?",
      "answer": "IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation."
    },
    {
      "question": "How can IT consulting benefit my business?",
      "answer": "IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation."
    },
    {
      "question":"How do I choose the right IT consulting firm?",
      "answer":"IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation."
    },
    {
      "question":"What skills are in demand in the IT industry?",
      "answer":"IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation."
    },
    {
      "question":"How important are certifications in the IT job market?",
      "answer":"IT consulting involves providing expert advice and services to organizations to help them improve their IT systems and infrastructure. This includes strategic planning, system integration, and technology implementation."
    }
  ]

  ngOnInit(): void {

  }

}
