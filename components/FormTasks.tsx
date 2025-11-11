'use client';
import { useForm } from 'react-hook-form';

export type FormTasksType = {
  title: string;
  description: string;
  id?: number;
};

function FormTasks({
  onSubmit,
  defaultValues
}: {
  onSubmit: (data: FormTasksType) => Promise<void>;
  defaultValues?: FormTasksType;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  const isEditing = !!defaultValues?.id;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-4">
      {}
      <input type="hidden" {...register('id')} />
      
      <input
        {...register('title')}
        placeholder="Nova tarefa"
        required
        className="border p-2 w-full mb-2"
      />
      <textarea
        {...register('description')}
        placeholder="Descrição da tarefa"
        required
        className="border p-2 w-full mb-2"
      />
      {}
      <button 
        type="submit" 
        className="bg-blue-400 text-white p-2 rounded w-"
      >
        {isEditing ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
      </button>
    </form>
  );
}

export default FormTasks;