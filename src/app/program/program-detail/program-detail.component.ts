import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProgramService} from '../program.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ProgramModel} from '../program-model';
import {ExerciseModel} from '../../exercise/exercise-model';
import {ExerciseService} from '../../exercise/exercise.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {LoadsModel} from "../../exercise/loads-model";

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {

  id: number;
  program: ProgramModel;
  exercises: ExerciseModel[];
  myLastLoad: string;
  showForm: boolean=false;
  showOption: boolean = false;
  exerciseToUpdate: ExerciseModel=null;
  updateMode: boolean;





  constructor(private programService: ProgramService,
              private router: Router,
              private exerciseService: ExerciseService,
              private route: ActivatedRoute,

             ) {}

  ngOnInit() {


    this.exerciseService.onExerciseAdded.subscribe(
      (data: ExerciseModel) => {
     //   console.log(data);
       this.exercises.push(data);
      // console.log(data.charges[data.charges.length-1]);
      }
    );
    this.route.params
      .subscribe(
        (params: Params) => {
          console.log("Details Changed");
          this.programService.onProgramChanged.next(null);
          this.id = +params['id'];
           this.programService.getProgramById(this.id).subscribe(
            (data: ProgramModel)=> {
           //   console.log(data);
              this.programService.onProgramChosen.next(data);
              this.program = data;
            }
          );

         this.exerciseService.gerMyExercise(this.id).subscribe(
           (data: ExerciseModel[]) => {
             this.exercises = data;
             for ( const exercise of this.exercises){
               this.exerciseService.gerMyLoads(exercise.idExercise).subscribe(
                 (loads: LoadsModel[]) => {
                   exercise.charges = loads;
                   this.myLastLoad = loads[loads.length - 1].charge;
                 }
               );
               }
           }
         );


        }
      );
    console.log(this.exercises);

    this.exerciseService.onExerciseUpdated.subscribe(
      (data: ExerciseModel) => {
        this.updateMode=false;
        this.showForm=false;
        this.router.navigate(['/program/'+this.id]);

      }
    );
//
  }
  onShowDetail(exercise: ExerciseModel) {
 //   console.log('program-detail ' + exercise.exerciseName);
   this.programService.showDetailExercise(exercise);
  }


  onEditExercise(idExercise: number){
    console.log(idExercise);

    this.exerciseService.getExerciseById(idExercise).subscribe(
      (data: ExerciseModel) =>{
        this.exerciseToUpdate=data;
        console.log(this.exerciseToUpdate);
        this.showForm=true;
        this.updateMode=true;
        this.showOption=false;
      }
    );
  }


  onShowForm() {
    if (this.showForm === false ) {
      this.updateMode=false;
      this.showForm = true;
    } else {
      this.showForm = false;
    }
  }
  onShowOption(){
    if (this.showOption === false ) {
      this.showOption = true;
    } else {
      this.showOption = false;
    }
  }


}
