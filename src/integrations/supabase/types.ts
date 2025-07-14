export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account_details_forms: {
        Row: {
          account_sold: boolean | null
          account_type: string
          application_id: string
          completed_at: string | null
          created_at: string | null
          current_balance: number
          current_company: string | null
          date_opened: string | null
          filled_by_admin_id: string | null
          id: string
          last_payment_date: string | null
          open_closed: string | null
          original_balance: number | null
          original_creditor: string
          paid_off: boolean | null
          payment_amount: number | null
          payment_frequency: string | null
          status: string | null
          term: string | null
          updated_at: string | null
        }
        Insert: {
          account_sold?: boolean | null
          account_type: string
          application_id: string
          completed_at?: string | null
          created_at?: string | null
          current_balance?: number
          current_company?: string | null
          date_opened?: string | null
          filled_by_admin_id?: string | null
          id?: string
          last_payment_date?: string | null
          open_closed?: string | null
          original_balance?: number | null
          original_creditor: string
          paid_off?: boolean | null
          payment_amount?: number | null
          payment_frequency?: string | null
          status?: string | null
          term?: string | null
          updated_at?: string | null
        }
        Update: {
          account_sold?: boolean | null
          account_type?: string
          application_id?: string
          completed_at?: string | null
          created_at?: string | null
          current_balance?: number
          current_company?: string | null
          date_opened?: string | null
          filled_by_admin_id?: string | null
          id?: string
          last_payment_date?: string | null
          open_closed?: string | null
          original_balance?: number | null
          original_creditor?: string
          paid_off?: boolean | null
          payment_amount?: number | null
          payment_frequency?: string | null
          status?: string | null
          term?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_details_forms_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_log_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          address: string | null
          approval_email_sent: boolean | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          credit_score: string | null
          date_of_birth: string | null
          debt_amount: number
          debt_range: string | null
          email: string
          employment_status: string | null
          enrollment_approved_at: string | null
          enrollment_status: string | null
          first_name: string
          id: string
          is_complete: boolean | null
          last_name: string
          monthly_income: number | null
          negotiations_approved_at: string | null
          negotiations_status: string | null
          phone: string
          ssn_last_four: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          approval_email_sent?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          credit_score?: string | null
          date_of_birth?: string | null
          debt_amount: number
          debt_range?: string | null
          email: string
          employment_status?: string | null
          enrollment_approved_at?: string | null
          enrollment_status?: string | null
          first_name: string
          id?: string
          is_complete?: boolean | null
          last_name: string
          monthly_income?: number | null
          negotiations_approved_at?: string | null
          negotiations_status?: string | null
          phone: string
          ssn_last_four?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          approval_email_sent?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          credit_score?: string | null
          date_of_birth?: string | null
          debt_amount?: number
          debt_range?: string | null
          email?: string
          employment_status?: string | null
          enrollment_approved_at?: string | null
          enrollment_status?: string | null
          first_name?: string
          id?: string
          is_complete?: boolean | null
          last_name?: string
          monthly_income?: number | null
          negotiations_approved_at?: string | null
          negotiations_status?: string | null
          phone?: string
          ssn_last_four?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      debt_accounts: {
        Row: {
          account_sold: boolean | null
          account_type: string
          application_id: string | null
          created_at: string | null
          current_balance: number
          date_opened: string | null
          id: string
          last_payment_date: string | null
          open_closed: string | null
          original_balance: number | null
          original_creditor: string
          paid_off: boolean | null
          payment_amount: number | null
          payment_frequency: string | null
          status: string | null
          term: string | null
          updated_at: string | null
        }
        Insert: {
          account_sold?: boolean | null
          account_type: string
          application_id?: string | null
          created_at?: string | null
          current_balance?: number
          date_opened?: string | null
          id?: string
          last_payment_date?: string | null
          open_closed?: string | null
          original_balance?: number | null
          original_creditor: string
          paid_off?: boolean | null
          payment_amount?: number | null
          payment_frequency?: string | null
          status?: string | null
          term?: string | null
          updated_at?: string | null
        }
        Update: {
          account_sold?: boolean | null
          account_type?: string
          application_id?: string | null
          created_at?: string | null
          current_balance?: number
          date_opened?: string | null
          id?: string
          last_payment_date?: string | null
          open_closed?: string | null
          original_balance?: number | null
          original_creditor?: string
          paid_off?: boolean | null
          payment_amount?: number | null
          payment_frequency?: string | null
          status?: string | null
          term?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debt_accounts_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          application_id: string | null
          created_at: string | null
          date_of_birth: string
          first_name: string
          id: string
          last_name: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          date_of_birth: string
          first_name: string
          id?: string
          last_name: string
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          date_of_birth?: string
          first_name?: string
          id?: string
          last_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          monthly_payment: number
          name: string
          program_length: number
          quote: string
          savings_percentage: number
          total_debt: number
          total_savings: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          monthly_payment: number
          name: string
          program_length: number
          quote: string
          savings_percentage: number
          total_debt: number
          total_savings: number
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          monthly_payment?: number
          name?: string
          program_length?: number
          quote?: string
          savings_percentage?: number
          total_debt?: number
          total_savings?: number
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          created_at: string | null
          details: string | null
          event: string
          id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          event: string
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          event?: string
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_application_completion: {
        Args: { app_id: string }
        Returns: number
      }
      demote_from_admin: {
        Args: { target_user_id: string }
        Returns: Json
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          action_name: string
          target_user?: string
          action_details?: Json
        }
        Returns: undefined
      }
      promote_to_admin: {
        Args: { target_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
