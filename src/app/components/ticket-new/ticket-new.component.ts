import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Ticket} from '../../model/ticket.model';
import {SharedService} from '../../services/shared.service';
import {TicketService} from '../../services/ticket.service';
import {ActivatedRoute} from '@angular/router';
import {ResponseApi} from '../../model/response-api';

@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.component.html',
  styleUrls: ['./ticket-new.component.css']
})
export class TicketNewComponent implements OnInit {

  @ViewChild('form')
  form: NgForm;

  ticket = new Ticket('', 0, '', '', '', '', '', null, null, '', null);
  shared = SharedService;
  message: {};
  classCss: {};
  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {
    this.shared.getInstance();
  }

  ngOnInit() {
    const id: string = this.route.snapshot.params['id'];
    if (id !== undefined) {
      this.findById(id);
    }
  }

  findById(id: string) {
    this.ticketService.findById(id).subscribe((responseApi: ResponseApi) => {
      this.ticket = responseApi.data;
    }, err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  register() {
    this.message = {};
    this.ticketService.createOrUpdate(this.ticket).subscribe((responseApi: ResponseApi) => {
      this.ticket = new Ticket('', 0, '', '', '', '', '', null, null, '', null);
      const ticket: Ticket = responseApi.data;
      this.form.resetForm();
      this.showMessage({ type: 'sucesso', text: `${ticket.title} registrado com sucesso!` });
    }, err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  onFileChange(event): void {
    if (event.target.files[0].size > 2000000) {
      this.showMessage({
        type: 'error',
        text: 'O tamanho máximo é de 2 MB!'
      });
    } else {
      this.ticket.image = '';
      const reader = new FileReader();
      reader.onloadend = ( e: Event) => {
        this.ticket.image = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private showMessage(message: {type: string, text: string}): void {
    this.message = message;
    this.buildClass(message.type);
    setTimeout(() => {
      this.message = undefined;
    }, 3000);
  }
  private buildClass(type: string): void {
    this.classCss = {
      'alert': true
    };
    this.classCss['alert-' + type] = true;
  }
}
