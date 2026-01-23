export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      categories: {
        Row: {
          color: string;
          created_at: string;
          icon: string;
          id: string;
          is_system: boolean;
          name: string;
        };
        Insert: {
          color: string;
          created_at?: string;
          icon: string;
          id?: string;
          is_system?: boolean;
          name: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          icon?: string;
          id?: string;
          is_system?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      debt_payments: {
        Row: {
          amount: number;
          created_at: string;
          date: string;
          debt_id: string;
          id: string;
          note: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          date?: string;
          debt_id: string;
          id?: string;
          note?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          date?: string;
          debt_id?: string;
          id?: string;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'debt_payments_debt_id_fkey';
            columns: ['debt_id'];
            isOneToOne: false;
            referencedRelation: 'debts';
            referencedColumns: ['id'];
          },
        ];
      };
      debts: {
        Row: {
          created_at: string;
          creditor: string;
          description: string | null;
          due_date: string | null;
          id: string;
          paid_amount: number;
          status: Database['public']['Enums']['debt_status'];
          total_amount: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          creditor: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          paid_amount?: number;
          status?: Database['public']['Enums']['debt_status'];
          total_amount: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          creditor?: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          paid_amount?: number;
          status?: Database['public']['Enums']['debt_status'];
          total_amount?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      goal_contributions: {
        Row: {
          amount: number;
          created_at: string;
          date: string;
          goal_id: string;
          id: string;
          note: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          date?: string;
          goal_id: string;
          id?: string;
          note?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          date?: string;
          goal_id?: string;
          id?: string;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'goal_contributions_goal_id_fkey';
            columns: ['goal_id'];
            isOneToOne: false;
            referencedRelation: 'goals';
            referencedColumns: ['id'];
          },
        ];
      };
      goals: {
        Row: {
          completed_at: string | null;
          created_at: string;
          current_amount: number;
          description: string | null;
          id: string;
          name: string;
          status: Database['public']['Enums']['goal_status'];
          target_amount: number;
          target_date: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          current_amount?: number;
          description?: string | null;
          id?: string;
          name: string;
          status?: Database['public']['Enums']['goal_status'];
          target_amount: number;
          target_date?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          current_amount?: number;
          description?: string | null;
          id?: string;
          name?: string;
          status?: Database['public']['Enums']['goal_status'];
          target_amount?: number;
          target_date?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          currency_symbol: string;
          id: string;
          name: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          currency_symbol?: string;
          id?: string;
          name?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          currency_symbol?: string;
          id?: string;
          name?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          amount: number;
          cancelled_at: string | null;
          created_at: string;
          description: string | null;
          frequency: Database['public']['Enums']['subscription_frequency'];
          id: string;
          name: string;
          next_billing_date: string;
          status: Database['public']['Enums']['subscription_status'];
          user_id: string;
        };
        Insert: {
          amount: number;
          cancelled_at?: string | null;
          created_at?: string;
          description?: string | null;
          frequency: Database['public']['Enums']['subscription_frequency'];
          id?: string;
          name: string;
          next_billing_date: string;
          status?: Database['public']['Enums']['subscription_status'];
          user_id: string;
        };
        Update: {
          amount?: number;
          cancelled_at?: string | null;
          created_at?: string;
          description?: string | null;
          frequency?: Database['public']['Enums']['subscription_frequency'];
          id?: string;
          name?: string;
          next_billing_date?: string;
          status?: Database['public']['Enums']['subscription_status'];
          user_id?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          category_id: string | null;
          created_at: string;
          date: string;
          description: string | null;
          id: string;
          source: string | null;
          type: Database['public']['Enums']['transaction_type'];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          created_at?: string;
          date?: string;
          description?: string | null;
          id?: string;
          source?: string | null;
          type: Database['public']['Enums']['transaction_type'];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          category_id?: string | null;
          created_at?: string;
          date?: string;
          description?: string | null;
          id?: string;
          source?: string | null;
          type?: Database['public']['Enums']['transaction_type'];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      debt_status: 'active' | 'paid';
      goal_status: 'active' | 'completed';
      subscription_frequency: 'monthly' | 'yearly';
      subscription_status: 'active' | 'cancelled';
      transaction_type: 'income' | 'expense';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      debt_status: ['active', 'paid'],
      goal_status: ['active', 'completed'],
      subscription_frequency: ['monthly', 'yearly'],
      subscription_status: ['active', 'cancelled'],
      transaction_type: ['income', 'expense'],
    },
  },
} as const;
