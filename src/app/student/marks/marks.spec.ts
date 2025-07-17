import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Marks } from './marks';

describe('Marks', () => {
  let component: Marks;
  let fixture: ComponentFixture<Marks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Marks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
