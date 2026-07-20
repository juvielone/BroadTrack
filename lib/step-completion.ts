import { supabase } from '@/lib/supabase'

export async function updateStepCompletion(stepId: string, completed: boolean, userId: string) {
  return supabase
    .from('procedure_steps')
    .update(
      completed
        ? { completed: true, completed_at: new Date().toISOString(), completed_by: userId }
        : { completed: false, completed_at: null, completed_by: null }
    )
    .eq('id', stepId)
}
